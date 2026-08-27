# Demo-only seed data

Every row in this directory is synthetic and marked
`DEMO_RESEARCH_GENERATED`. It exists to exercise tooling and UI contracts; it is
not verified Mongolia tourism knowledge and must not be cited as fact or included
in thesis results.

The two records whose IDs start with `demo-evaluation-` also set
`evaluationOnly=true`. The grouped splitter forces their entire `splitGroup` into
the test split, and the leakage audit fails if they appear in train or validation.

Before any real training run, replace these records with source-derived,
human-reviewed examples and retain source IDs, verification dates, license/use
status, and split groups.
