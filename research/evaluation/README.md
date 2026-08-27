# Evaluation CSV support

The example CSV files are synthetic tooling fixtures. Their values are not study
results and must never appear in thesis result tables.

Run the metric calculators from the repository root:

```bash
python3 -m research.scripts.evaluate_csv travel \
  research/evaluation/demo_travel_evaluations.csv /tmp/travel-metrics.json \
  --summary-csv /tmp/travel-by-mode.csv

python3 -m research.scripts.evaluate_csv guide \
  research/evaluation/demo_guide_evaluations.csv /tmp/guide-metrics.json \
  --summary-csv /tmp/guide-by-mode.csv --bootstrap-iterations 1000
```

Travel output includes factual/personalization means; hallucination, POI,
spatial, temporal, budget, season, safety, and final-validity rates; latency
percentiles; token totals; and estimated cost. Boolean rates include Wilson 95%
confidence intervals.

Guide output includes Pearson and Spearman correlations, mean absolute error,
seeded bootstrap intervals, pass confusion metrics, Cohen's kappa, safety
precision/recall/F1/false-negative/false-positive rates, CEFR agreement, and
Fleiss' kappa when per-reviewer pass columns are present.

Blank/invalid cells are excluded separately for each metric, and every metric
reports its own sample size. Inspect missingness before comparing modes. Tiny demo
samples can produce undefined correlations or very wide intervals; the script
returns JSON `null` rather than inventing a value.

Column definitions are in [DATASET_FORMATS.md](../docs/DATASET_FORMATS.md).
