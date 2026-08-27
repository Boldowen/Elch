# Ethics and privacy protocol

## Claims and human oversight

- AI guide assessment is platform/research pre-screening, not a government exam,
  professional license, employment decision, or official certification.
- An AI language result must be labeled **AI Language Estimate** with confidence;
  it is not an official CEFR certificate.
- First-aid question performance measures theory only. It must never set practical
  verification or replace a certificate and human/practical check.
- Route risk levels R0–R4 are internal research classifications, not official
  government classifications.
- Important competency, document, safety, and high-risk route decisions require an
  accountable human reviewer. Blind evaluation should hide AI scores until the
  reviewer has submitted an independent judgment.

## Data minimization

Collect only data needed for the stated research question. Do not solicit medical
conditions unless a traveler voluntarily supplies a constraint needed for their
request. Do not place identity documents, certificate images, exact addresses,
phone numbers, email addresses, authentication tokens, health details, or payment
data in prompts, training files, Git, or research exports.

Application logs should retain pseudonymous subject IDs, experiment configuration,
metrics, controlled tool names, and structured validator results. They should not
retain raw secrets or unrelated conversation history.

## Consent and withdrawal

Before collecting guide speech, open responses, documents, or expert ratings:

1. Record the study purpose, data types, storage locations, retention period,
   intended model use, researchers with access, and withdrawal process.
2. Obtain explicit, versioned consent. Silence or platform registration is not
   research consent.
3. Store the consent record separately from the pseudonymous dataset.
4. Support withdrawal by maintaining a private subject-to-pseudonym mapping and a
   deletion/tombstone procedure. Never publish that mapping.

If an adapter was trained before a valid withdrawal, document whether retraining is
required and do not falsely claim that influence can be removed from an existing
model without evidence.

## Anonymization and exports

Use a private, randomly generated export salt of at least 16 characters. The
provided exporter uses field-specific HMAC pseudonyms so joins remain possible
without publishing application IDs. Never commit the salt or include it in an
export manifest. Rotate it when sharing with a different recipient unless a
documented longitudinal join is required.

Text can itself contain identity or health information; field filtering is not a
complete de-identification method. Human review and, where appropriate, an approved
automated PII scan are required before external release. Small groups, unusual
routes, dates, and free-text narratives can be indirectly identifying.

## Data governance

- Keep raw, cleaned, reviewed, split, and exported zones separate.
- Grant least-privilege access and audit sensitive review/export actions.
- Define retention and deletion periods before collection.
- Record source licenses and permitted uses before corpus ingestion.
- Encrypt protected research storage and backups; Git is not protected storage.
- Report data incidents through the institution's approved process.

## Fairness and limitations

Report performance by language, route family, task type, and relevant consented
subgroups when sample sizes make reporting safe. Do not tune thresholds on the
frozen test set or suppress negative results. Document missing data, evaluator
disagreement, model/provider changes, and selection bias. A high aggregate score
must never override a failed route or safety hard gate.
