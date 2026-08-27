# Manual offline QLoRA training

Training is intentionally separate from application startup. Nothing in this
directory downloads a model, installs packages, or starts training automatically.
`train_qlora.py` forces Hugging Face offline flags and passes
`local_files_only=true` to model and tokenizer loading.

## Prerequisites

- Python 3.11 or newer in an isolated environment.
- A compatible CUDA GPU and enough memory for the selected model/context length.
- A base model and tokenizer already downloaded to local storage through an
  independently approved process. Record its exact version, license, and hash.
- Leakage-audited train and validation JSONL files with reviewed
  `expectedResponse` targets.

Install the optional research dependencies manually:

```bash
python3 -m venv .venv-research
source .venv-research/bin/activate
python3 -m pip install --requirement research/training/requirements.txt
```

Do not install these packages in the backend runtime image.

## Configure and validate

```bash
cp research/training/config.example.json research/training/config.local.json
# Edit every local path and verify the model's target module names.

python3 research/training/train_qlora.py \
  --config research/training/config.local.json \
  --validate-only
```

Keep `config.local.json`, downloaded model weights, checkpoints, and adapter output
out of Git. `--validate-only` checks that all inputs are local, refuses
`evaluationOnly` records, refuses cross-split IDs/groups, and rejects demo records
by default. It does not import PyTorch or load the model.

## Train

```bash
python3 research/training/train_qlora.py \
  --config research/training/config.local.json
```

The output directory must not already exist. It receives:

- `training-manifest.json` with dataset hashes, configuration, environment, and
  package versions;
- adapter weights only under `adapter/`;
- tokenizer snapshot and trainer state/checkpoints.

The supplied defaults are placeholders, not claimed optimal hyperparameters.
Validate `target_modules` for the chosen architecture. Record GPU, driver/CUDA
versions, peak memory, training/evaluation loss, duration, and any deviations.

## Safety boundaries

- Never enable `allow_demo_training` for a thesis or production adapter.
- Never include the frozen test set, assessment answer bank, consent mapping,
  identity documents, health information, or secrets.
- Training success does not validate factuality, route feasibility, guide
  competence, or safety. Evaluate the adapter in the same blinded A–E protocol.
- A LoRA adapter inherits the base model's license and risks; review both before
  distribution.
