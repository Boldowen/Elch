#!/usr/bin/env python3
"""Manual, offline-only QLoRA training entry point for local model artifacts."""

from __future__ import annotations

import argparse
import hashlib
import importlib.metadata
import json
import os
import platform
import random
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

# These are intentionally unconditional. A training run must never fetch a model
# or tokenizer from the network as a side effect.
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"


@dataclass(frozen=True)
class TrainingConfig:
    base_model_path: Path
    tokenizer_path: Path
    train_dataset_path: Path
    validation_dataset_path: Path
    output_adapter_path: Path
    prompt_version: str
    seed: int = 20260815
    epochs: float = 3.0
    learning_rate: float = 0.0002
    max_sequence_length: int = 2048
    train_batch_size: int = 1
    eval_batch_size: int = 1
    gradient_accumulation_steps: int = 16
    logging_steps: int = 10
    lora_rank: int = 16
    lora_alpha: int = 32
    lora_dropout: float = 0.05
    target_modules: tuple[str, ...] = ("q_proj", "k_proj", "v_proj", "o_proj")
    use_bf16: bool = True
    allow_demo_training: bool = False


def _resolve(config_directory: Path, value: Any, field: str) -> Path:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be a non-empty local path")
    path = Path(value).expanduser()
    return (path if path.is_absolute() else config_directory / path).resolve()


def load_config(path: Path) -> TrainingConfig:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Cannot parse training config {path}: {exc}") from exc
    if not isinstance(raw, dict):
        raise ValueError("training config must be a JSON object")
    directory = path.resolve().parent
    base = _resolve(directory, raw.get("base_model_path"), "base_model_path")
    target_modules = raw.get("target_modules", ["q_proj", "k_proj", "v_proj", "o_proj"])
    if not isinstance(target_modules, list) or not target_modules or not all(isinstance(item, str) and item for item in target_modules):
        raise ValueError("target_modules must be a non-empty string array")
    prompt_version = raw.get("prompt_version")
    if not isinstance(prompt_version, str) or not prompt_version.strip():
        raise ValueError("prompt_version is required for reproducibility")
    return TrainingConfig(
        base_model_path=base,
        tokenizer_path=_resolve(directory, raw.get("tokenizer_path", str(base)), "tokenizer_path"),
        train_dataset_path=_resolve(directory, raw.get("train_dataset_path"), "train_dataset_path"),
        validation_dataset_path=_resolve(directory, raw.get("validation_dataset_path"), "validation_dataset_path"),
        output_adapter_path=_resolve(directory, raw.get("output_adapter_path"), "output_adapter_path"),
        prompt_version=prompt_version,
        seed=int(raw.get("seed", 20260815)),
        epochs=float(raw.get("epochs", 3.0)),
        learning_rate=float(raw.get("learning_rate", 0.0002)),
        max_sequence_length=int(raw.get("max_sequence_length", 2048)),
        train_batch_size=int(raw.get("train_batch_size", 1)),
        eval_batch_size=int(raw.get("eval_batch_size", 1)),
        gradient_accumulation_steps=int(raw.get("gradient_accumulation_steps", 16)),
        logging_steps=int(raw.get("logging_steps", 10)),
        lora_rank=int(raw.get("lora_rank", 16)),
        lora_alpha=int(raw.get("lora_alpha", 32)),
        lora_dropout=float(raw.get("lora_dropout", 0.05)),
        target_modules=tuple(target_modules),
        use_bf16=bool(raw.get("use_bf16", True)),
        allow_demo_training=bool(raw.get("allow_demo_training", False)),
    )


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_training_rows(path: Path, *, allow_demo: bool) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{line_number}: invalid JSON: {exc.msg}") from exc
            if not isinstance(record, dict):
                raise ValueError(f"{path}:{line_number}: row must be an object")
            if record.get("evaluationOnly") is True:
                raise ValueError(f"{path}:{line_number}: evaluationOnly record is forbidden in training inputs")
            if record.get("dataStatus") == "DEMO_RESEARCH_GENERATED" and not allow_demo:
                raise ValueError(f"{path}:{line_number}: demo data is forbidden unless allow_demo_training=true")
            for field in ("id", "instruction", "input", "expectedResponse", "splitGroup", "provenance"):
                if field not in record:
                    raise ValueError(f"{path}:{line_number}: missing required field {field}")
            if not isinstance(record["expectedResponse"], str) or not record["expectedResponse"].strip():
                raise ValueError(f"{path}:{line_number}: expectedResponse must be non-empty")
            records.append(record)
    if not records:
        raise ValueError(f"{path}: training dataset is empty")
    return records


def validate_inputs(config: TrainingConfig) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    if not config.base_model_path.is_dir():
        raise ValueError(f"base_model_path must already exist locally: {config.base_model_path}")
    if not config.tokenizer_path.is_dir():
        raise ValueError(f"tokenizer_path must already exist locally: {config.tokenizer_path}")
    for path in (config.train_dataset_path, config.validation_dataset_path):
        if not path.is_file():
            raise ValueError(f"dataset must already exist locally: {path}")
    if config.output_adapter_path == config.base_model_path:
        raise ValueError("output_adapter_path cannot overwrite base_model_path")
    if config.epochs <= 0 or config.learning_rate <= 0:
        raise ValueError("epochs and learning_rate must be positive")
    if config.max_sequence_length < 128:
        raise ValueError("max_sequence_length must be at least 128")
    train_rows = read_training_rows(config.train_dataset_path, allow_demo=config.allow_demo_training)
    validation_rows = read_training_rows(config.validation_dataset_path, allow_demo=config.allow_demo_training)
    train_ids = {str(record["id"]) for record in train_rows}
    validation_ids = {str(record["id"]) for record in validation_rows}
    train_groups = {str(record["splitGroup"]) for record in train_rows}
    validation_groups = {str(record["splitGroup"]) for record in validation_rows}
    if overlap := train_ids & validation_ids:
        raise ValueError(f"train/validation ID leakage detected: {sorted(overlap)[:5]}")
    if overlap := train_groups & validation_groups:
        raise ValueError(f"train/validation group leakage detected: {sorted(overlap)[:5]}")
    return train_rows, validation_rows


def package_versions(names: list[str]) -> dict[str, str]:
    versions: dict[str, str] = {}
    for name in names:
        try:
            versions[name] = importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError:
            versions[name] = "NOT_INSTALLED"
    return versions


def render_user(record: dict[str, Any]) -> str:
    return f"{record['instruction'].strip()}\n\nInput:\n{json.dumps(record['input'], ensure_ascii=False, sort_keys=True)}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--validate-only", action="store_true", help="Validate local paths, records, and leakage without loading a model")
    args = parser.parse_args(argv)
    try:
        config = load_config(args.config)
        train_rows, validation_rows = validate_inputs(config)
    except (OSError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    validation_summary = {
        "offlineOnly": True,
        "baseModelPath": str(config.base_model_path),
        "trainRecords": len(train_rows),
        "validationRecords": len(validation_rows),
        "trainSha256": sha256(config.train_dataset_path),
        "validationSha256": sha256(config.validation_dataset_path),
    }
    if args.validate_only:
        print(json.dumps(validation_summary, indent=2, sort_keys=True))
        return 0

    # Heavy dependencies are imported only for an explicit training command.
    try:
        import torch
        from datasets import Dataset
        from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
        from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, DataCollatorForSeq2Seq, Trainer, TrainingArguments
    except ImportError as exc:
        print(f"Training dependencies are missing: {exc}. Install research/training/requirements.txt manually.", file=sys.stderr)
        return 1
    if not torch.cuda.is_available():
        print("QLoRA training requires a compatible CUDA GPU; no CUDA device was detected.", file=sys.stderr)
        return 1

    random.seed(config.seed)
    torch.manual_seed(config.seed)
    compute_dtype = torch.bfloat16 if config.use_bf16 and torch.cuda.is_bf16_supported() else torch.float16
    quantization = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_use_double_quant=True, bnb_4bit_compute_dtype=compute_dtype)
    tokenizer = AutoTokenizer.from_pretrained(str(config.tokenizer_path), local_files_only=True, trust_remote_code=False)
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained(
        str(config.base_model_path),
        local_files_only=True,
        trust_remote_code=False,
        quantization_config=quantization,
        device_map="auto",
    )
    model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=True)
    model = get_peft_model(model, LoraConfig(r=config.lora_rank, lora_alpha=config.lora_alpha, lora_dropout=config.lora_dropout, bias="none", task_type="CAUSAL_LM", target_modules=list(config.target_modules)))

    def format_prompt(record: dict[str, Any], include_answer: bool) -> str:
        messages = [
            {"role": "system", "content": "You are a Mongolia tourism research assistant. Follow verified sources, tools, deterministic validators, and safety gates."},
            {"role": "user", "content": render_user(record)},
        ]
        if include_answer:
            messages.append({"role": "assistant", "content": record["expectedResponse"].strip()})
        if getattr(tokenizer, "chat_template", None):
            return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=not include_answer)
        prompt = "\n\n".join(f"{message['role'].upper()}: {message['content']}" for message in messages)
        return prompt + ("\n\nASSISTANT:" if not include_answer else "")

    def tokenize(record: dict[str, Any]) -> dict[str, list[int]]:
        prompt_text = format_prompt(record, include_answer=False)
        full_text = format_prompt(record, include_answer=True)
        prompt_ids = tokenizer(prompt_text, add_special_tokens=True, truncation=True, max_length=config.max_sequence_length)["input_ids"]
        encoded = tokenizer(full_text, add_special_tokens=True, truncation=True, max_length=config.max_sequence_length)
        input_ids = encoded["input_ids"]
        prompt_length = min(len(prompt_ids), len(input_ids))
        labels = [-100] * prompt_length + input_ids[prompt_length:]
        return {"input_ids": input_ids, "attention_mask": encoded["attention_mask"], "labels": labels}

    train_dataset = Dataset.from_list(train_rows).map(tokenize, remove_columns=list(train_rows[0]))
    validation_dataset = Dataset.from_list(validation_rows).map(tokenize, remove_columns=list(validation_rows[0]))
    train_dataset = train_dataset.filter(lambda row: any(label != -100 for label in row["labels"]))
    validation_dataset = validation_dataset.filter(lambda row: any(label != -100 for label in row["labels"]))
    if not len(train_dataset) or not len(validation_dataset):
        print("Token truncation removed every supervised target; increase max_sequence_length or shorten prompts.", file=sys.stderr)
        return 1

    config.output_adapter_path.mkdir(parents=True, exist_ok=False)
    manifest = {
        **validation_summary,
        "config": {key: str(value) if isinstance(value, Path) else list(value) if isinstance(value, tuple) else value for key, value in asdict(config).items()},
        "python": platform.python_version(),
        "platform": platform.platform(),
        "packages": package_versions(["torch", "transformers", "datasets", "peft", "accelerate", "bitsandbytes"]),
    }
    (config.output_adapter_path / "training-manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    arguments = TrainingArguments(
        output_dir=str(config.output_adapter_path / "checkpoints"),
        num_train_epochs=config.epochs,
        learning_rate=config.learning_rate,
        per_device_train_batch_size=config.train_batch_size,
        per_device_eval_batch_size=config.eval_batch_size,
        gradient_accumulation_steps=config.gradient_accumulation_steps,
        logging_steps=config.logging_steps,
        eval_strategy="epoch",
        save_strategy="epoch",
        report_to=[],
        seed=config.seed,
        data_seed=config.seed,
        bf16=compute_dtype == torch.bfloat16,
        fp16=compute_dtype == torch.float16,
        gradient_checkpointing=True,
        optim="paged_adamw_8bit",
        remove_unused_columns=False,
    )
    trainer = Trainer(model=model, args=arguments, train_dataset=train_dataset, eval_dataset=validation_dataset, data_collator=DataCollatorForSeq2Seq(tokenizer=tokenizer, label_pad_token_id=-100, pad_to_multiple_of=8))
    trainer.train()
    model.save_pretrained(config.output_adapter_path / "adapter")
    tokenizer.save_pretrained(config.output_adapter_path / "tokenizer")
    trainer.save_state()
    print(json.dumps({"status": "complete", "adapter": str(config.output_adapter_path / "adapter")}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
