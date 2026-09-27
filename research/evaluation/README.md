# Evaluation CSV support

The example CSV files are synthetic tooling fixtures. Their values are not study
results and must never appear in thesis result tables.

## One command for every primary metric

The master plan's definition of done (section 15.3) requires the primary metrics
to be reproducible from a single command. `run_primary_metrics.py` reads
[`primary_metrics.manifest.json`](primary_metrics.manifest.json), runs every
report named there, and writes the results plus an index that records each
input's SHA-256 into `research/evaluation/results/`:

```bash
make research-metrics ALLOW_DEMO=1          # from the repository root
# or, equivalently:
python3 -m research.scripts.run_primary_metrics --allow-demo --force
```

`--allow-demo` is mandatory while the manifest still points at fixtures: any
input whose `data_status` contains `DEMO` is refused without it, so a fixture run
cannot be mistaken for a result. Point the manifest at the frozen evaluation
exports and drop the flag for a real run. The output directory is generated and
is not committed.

## Individual reports

```bash
python3 -m research.scripts.evaluate_csv travel \
  research/evaluation/demo_travel_evaluations.csv /tmp/travel-metrics.json \
  --summary-csv /tmp/travel-by-mode.csv

python3 -m research.scripts.evaluate_csv guide \
  research/evaluation/demo_guide_evaluations.csv /tmp/guide-metrics.json \
  --summary-csv /tmp/guide-by-mode.csv --bootstrap-iterations 1000

python3 -m research.scripts.evaluate_csv match \
  research/evaluation/demo_match_evaluations.csv /tmp/match-metrics.json --top-k 5

python3 -m research.scripts.evaluate_csv items \
  research/evaluation/demo_item_responses.csv /tmp/item-metrics.json \
  --group-field form_id
```

### `travel` — plan sections 12.1 and 12.3

Factual, personalization and spatial-score means; hallucination, POI, spatial,
temporal, budget, season, safety and final-validity rates; tool-selection
accuracy; whether an unsolvable case was declared correctly; the five human 1-5
review axes (feasibility, factuality, usefulness, personalization, safety);
expected calibration error against `ai_confidence`; latency percentiles; token
totals; and estimated cost.

### `guide` — plan section 12.2

Pearson, Spearman and ICC(2,1) against the human score, mean absolute error,
seeded bootstrap intervals, pass confusion metrics with Cohen's kappa, safety
precision/recall/F1 with the false-negative rate reported explicitly, CEFR exact
and within-one-band agreement with quadratic weighted kappa, expected
calibration error, and Fleiss' kappa when per-reviewer pass columns are present.

ICC is reported alongside Pearson because a rater can correlate perfectly while
scoring consistently high or low; ICC penalises that offset, Pearson does not.

### `match` — plan section 9.2

One row per ranked candidate, grouped by `match_run_id`: NDCG@k, top-k agreement
with the blind expert ranking, the gate-blocked rate, and the unsafe
recommendation rate with its detection confusion matrix. Per plan section 12.2
the unsafe-recommendation false-negative rate is reported separately from
ranking quality rather than folded into an overall accuracy number.

### `items` — plan section 12.2 rubric quality

One row per candidate answer: per-item difficulty and point-biserial
discrimination against the rest-of-test score, plus KR-20 internal consistency
for each form. An item everyone answered the same way has no variance, so its
discrimination is reported as `null` rather than as a number.

## Reading the output

Blank/invalid cells are excluded separately for each metric, and every metric
reports its own sample size. Inspect missingness before comparing modes. Tiny
demo samples can produce undefined correlations or very wide intervals; the
script returns JSON `null` rather than inventing a value.

Column definitions are in [DATASET_FORMATS.md](../docs/DATASET_FORMATS.md).
