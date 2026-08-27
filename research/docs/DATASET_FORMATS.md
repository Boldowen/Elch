# Research dataset formats

All source datasets use UTF-8 JSONL: one JSON object per non-empty line. Raw,
cleaned, split, and exported files must live in separate paths so raw evidence is
never overwritten.

## Common envelope

Every record requires:

- `id`: immutable unique ID; use a pseudonymous ID for people.
- `dataStatus`: one of `VERIFIED_SOURCE_DERIVED`,
  `SYNTHETIC_SOURCE_DERIVED`, `COLLECTED_WITH_CONSENT`, or
  `DEMO_RESEARCH_GENERATED`.
- `splitGroup`: the unit that must remain in one split. Choose the widest relevant
  unit: source + POI/concept for tourism facts, route/scenario family for itinerary
  tasks, and speaker ID for speech.
- `provenance.sourceIds`: source-registry IDs for source-derived examples.
- `provenance.humanReviewed`: whether a named research review process was completed.
- `evaluationOnly`: `true` for frozen evaluation items and assessment question
  banks. The splitter forces their entire group into `test`.

`DEMO_RESEARCH_GENERATED` rows are tooling fixtures only. Validation rejects them
unless `--allow-demo` is supplied, and training rejects them unless the training
configuration explicitly sets `allow_demo_training=true`.

## Instruction rows

```json
{
  "id": "instruction-0001",
  "dataStatus": "SYNTHETIC_SOURCE_DERIVED",
  "instruction": "Plan a Mongolia trip",
  "input": {"days": 7, "interests": ["history"]},
  "expectedBehavior": {
    "askMissingInformation": true,
    "useRouteTool": true,
    "validateConstraints": true
  },
  "expectedResponse": "A reviewed target response used only for supervised training.",
  "splitGroup": "source-id:poi-id:planning-concept",
  "evaluationOnly": false,
  "provenance": {
    "sourceIds": ["source-id"],
    "humanReviewed": true,
    "licenseStatus": "APPROVED_FOR_RESEARCH"
  }
}
```

`expectedBehavior` supports behavioral evaluation, while `expectedResponse` is the
supervised target. A record without `expectedResponse` may be evaluated but cannot
be used by the supplied QLoRA trainer.

## Tourism knowledge rows

Required fields are `id`, `sourceId`, `content`, `category`, `language`,
`lastVerifiedAt`, `splitGroup`, `dataStatus`, and `provenance`. Chunk boundaries
must not remove the source, route family, region, authority tier, or freshness
metadata. A source URL alone does not verify every claim in a chunk.

## Assessment questions

Required fields are `category`, `difficulty`, `questionType`, `language`, `prompt`,
and either `answerKey` or `scoringRubric`. They must set `evaluationOnly=true`.
Answer-key datasets belong in access-controlled research storage and must never be
returned by normal guide APIs.

## Speech rows

Speech requires `dataStatus=COLLECTED_WITH_CONSENT`, pseudonymous `speakerId`,
`provenance.consentRecordId`, `provenance.anonymized=true`, and a transcript or a
protected audio reference. Consent records and raw audio do not belong in Git.

## Travel evaluation CSV

The metric script expects these optional columns; blank cells are excluded per
metric:

- Identity/configuration: `run_id`, `experiment_mode`, `data_status`.
- Scores or flags: `factual_accuracy`, `hallucination_detected`, `poi_validity`,
  `spatial_feasibility`, `temporal_feasibility`, `budget_compliance`,
  `season_compliance`, `safety_violation`, `personalization_score`,
  `final_validity`.
- Operational measures: `latency_ms`, `input_tokens`, `output_tokens`,
  `estimated_cost_usd`.

Boolean values accept `true/false`, `yes/no`, or `1/0`. Accuracy and
personalization use a documented 0–1 scale.

## Guide evaluation CSV

Expected columns are `attempt_id`, `experiment_mode`, `ai_score`, `human_score`,
`ai_pass`, `human_pass`, `ai_cefr`, `human_cefr`, `ai_safety_flag`, and
`human_safety_flag`. Here a positive safety flag means an unsafe action or safety
risk was detected. Optional `reviewer_pass_1`, `reviewer_pass_2`, … columns enable
Fleiss' kappa when every included row has the same number of raters.

Store raw per-reviewer judgments. Consensus values alone cannot reproduce
inter-rater agreement.
