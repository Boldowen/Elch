# ELCH research reproducibility package

This directory is the version-controlled home for the research artifacts described in
`Mongolia_Tourism_AI_Bachelor_Research_Master_Plan.pdf`.

Code and demo fixtures are not a completed experiment. Before participant collection
or an A-E comparison, complete the controlled-research gates in
[the launch readiness runbook](../docs/LAUNCH_READINESS.md) and the consent/withdrawal
requirements in [Ethics and privacy](docs/ETHICS_AND_PRIVACY.md).

## Experiment tracks

| ID | Model | RAG | LoRA | RouteGraph / validator |
|---|---|---:|---:|---:|
| A (legacy E0) | base | no | no | no |
| B (legacy E1) | base | yes | no | no |
| C (legacy E2) | domain adapter | no | yes | no |
| D (legacy E3) | domain adapter | yes | yes | no |
| E (legacy E4) | domain adapter | yes | yes | yes |

Prototype components and this tooling do not establish an E0-E4 result. A real
base model/provider, verified corpus, embeddings, LoRA adapter, frozen evaluation
set, and human evaluation must be selected and versioned before making any
experimental claim.

## Data rules

- Store source authority, license/use note and `last_verified_at` for every source.
- Never put raw identity, medical or guide-document images in training data.
- Split by POI/concept/route/speaker, not only by exact question text.
- Synthetic examples must be source-derived and human spot-checked.
- Do not edit evaluation metrics after the experiment freeze.

`datasets/manifest.example.json` defines the expected datasets without pretending that
the target sample sizes have already been collected. `experiments/a-e.json` is the
canonical runtime configuration; `E0`–`E4` remain documented legacy thesis aliases.

## Phase 7 tooling

All dataset and evaluation utilities use only the Python standard library. Run
them from the repository root:

```bash
# Demo validation is opt-in so fixture data cannot be mistaken for real data.
python3 -m research.scripts.validate_jsonl \
  research/datasets/demo/instruction_seed.demo.jsonl \
  --kind instruction --allow-demo

# A real pipeline uses separate raw, working, and processed paths.
python3 -m research.scripts.clean_jsonl INPUT.jsonl CLEAN.jsonl \
  --drop-sensitive-fields
python3 -m research.scripts.dedupe_jsonl CLEAN.jsonl DEDUPED.jsonl
python3 -m research.scripts.group_split_jsonl \
  DEDUPED.jsonl research/datasets/processed --group-fields splitGroup
python3 -m research.scripts.leakage_audit \
  --train research/datasets/processed/train.jsonl \
  --validation research/datasets/processed/validation.jsonl \
  --test research/datasets/processed/test.jsonl
```

Additional entry points:

- `scripts/export_research_data.py` produces field-whitelisted CSV/JSON with
  HMAC-pseudonymized IDs and a hash manifest.
- `scripts/evaluate_csv.py` calculates travel and guide metrics without a
  statistics dependency.
- `training/train_qlora.py` is a manual CUDA QLoRA command. It forces offline
  model loading and rejects demo/evaluation/leaky training data by default.

Read before collecting or training:

- [Dataset formats](docs/DATASET_FORMATS.md)
- [Ethics and privacy](docs/ETHICS_AND_PRIVACY.md)
- [Reproducibility protocol](docs/REPRODUCIBILITY.md)
- [Evaluation guide](evaluation/README.md)
- [Manual QLoRA guide](training/README.md)

## Self-test

```bash
python3 -m compileall -q research/scripts research/training research/tests
python3 -m unittest discover -s research/tests -v
```

## Study launch gate

The following work is intentionally not automated or claimed complete:

- institutional ethics approval and a versioned consent/withdrawal register;
- source-by-source license and claim verification in an auditable registry;
- expert-reviewed routes, questions, rubrics, prompts, and safety policy;
- consented participant recruitment and data collection;
- frozen grouped splits, corpus/model/adapter hashes, and blind-review assignments;
- real QLoRA training, A-E execution, independent scoring, statistical analysis,
  subgroup fairness review, and thesis reporting.

Keep all demo records out of thesis result tables. Preserve raw runs and exclusions,
and record nulls/failures rather than backfilling them with model-generated labels.
