# Reproducibility protocol

## Experiment identifiers

The application-facing canonical modes are `A`, `B`, `C`, `D`, and `E`. The
original research artifact uses `E0` through `E4`; retain this fixed mapping when
importing legacy records:

| Canonical | Legacy | Configuration |
|---|---|---|
| A | E0 | base model |
| B | E1 | base model + RAG |
| C | E2 | domain adapter |
| D | E3 | domain adapter + RAG |
| E | E4 | domain adapter + RAG + RouteGraph + tools + validator |

Store `experiment_mode` and, when needed, `legacy_track_id`. Never compare records
whose actual feature flags disagree with their label.

## Freeze checklist

Before an experiment run, freeze and hash:

1. Git commit and dirty-worktree status.
2. Dataset files and grouped split manifest.
3. Source-registry version and freshness cutoff.
4. Base model path/version/hash and adapter hash.
5. Prompt/rubric versions.
6. Experiment feature flags, retrieval `top_k` and score threshold.
7. RouteGraph and risk-policy versions.
8. Random seeds, package versions, hardware, and precision settings.
9. Evaluator instructions and blind-review procedure.
10. Metric definitions and exclusion policy.

Preserve raw run outputs append-only. Corrections create a new version linked to
the original; they do not silently rewrite prior results.

## Dataset pipeline

Run from the repository root with Python 3.11 or newer:

```bash
python3 -m research.scripts.validate_jsonl \
  research/datasets/raw/instructions.jsonl --kind instruction --strict

python3 -m research.scripts.clean_jsonl \
  research/datasets/raw/instructions.jsonl \
  research/datasets/working/instructions.clean.jsonl \
  --drop-sensitive-fields --report research/datasets/working/clean-report.json

python3 -m research.scripts.dedupe_jsonl \
  research/datasets/working/instructions.clean.jsonl \
  research/datasets/working/instructions.deduped.jsonl \
  --report research/datasets/working/dedupe-report.json

python3 -m research.scripts.group_split_jsonl \
  research/datasets/working/instructions.deduped.jsonl \
  research/datasets/processed --group-fields splitGroup \
  --seed thesis-freeze-v1

python3 -m research.scripts.leakage_audit \
  --train research/datasets/processed/train.jsonl \
  --validation research/datasets/processed/validation.jsonl \
  --test research/datasets/processed/test.jsonl \
  --report research/datasets/processed/leakage-report.json
```

`split-manifest.json` records source/output SHA-256 hashes, seed, group fields,
ratios, counts, and assignments. Archive it with every run. Hash-based assignment
can make a small split empty; check counts before training and freeze a documented
seed rather than repeatedly trying seeds for favorable results.

String leakage checks cannot identify every paraphrase. `splitGroup` is the primary
control and must encode shared facts, POIs, routes, safety scenarios, and speakers.

## Evaluation and export

```bash
python3 -m research.scripts.evaluate_csv travel \
  research/evaluation/travel_runs.csv \
  research/evaluation/results/travel_metrics.json \
  --summary-csv research/evaluation/results/travel_by_mode.csv

python3 -m research.scripts.evaluate_csv guide \
  research/evaluation/guide_scores.csv \
  research/evaluation/results/guide_metrics.json \
  --summary-csv research/evaluation/results/guide_by_mode.csv \
  --seed 20260815 --bootstrap-iterations 5000

export RESEARCH_EXPORT_SALT='generate-a-private-random-value'
python3 -m research.scripts.export_research_data \
  research/evaluation/runs.jsonl research/evaluation/results/runs.csv \
  --fields runId,experimentMode,guideId,latencyMs,inputTokens,outputTokens,finalValidity
unset RESEARCH_EXPORT_SALT
```

Do not put the salt directly in shell history in real studies; inject it through an
approved secret manager. The exporter creates a sidecar manifest with input/output
hashes and never stores the salt.

## Minimum run record

Every result should retain run ID, canonical experiment mode, resolved feature
flags, model/adapter identifiers, prompt version, route family, request type,
latency, token counts, cost method/version, controlled tool calls, validator result,
final validity, failure reason, and creation time. Evaluation annotations must
retain evaluator ID pseudonyms and whether the review was blind.

The purpose is to measure whether each intervention helps. Preserve failures and
nulls, state exclusions before analysis, and never fill missing human judgments
with AI-generated labels.
