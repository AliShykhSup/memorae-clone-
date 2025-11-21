# Time Capsule — Use Cases

This document lists primary use cases for the Time Capsule application. Each use case includes actors, preconditions, triggers, the main success scenario and important alternate flows. Use cases are written for the MVP and prioritized for implementation.

---

## UC-01: Create a Capsule
- Actors: Registered User (Creator)
- Priority: High
- Precondition: User is authenticated and has a verified email. Storage quota available.
- Trigger: User selects "Create Capsule" in the app.
- Main Success Scenario:
  1. User opens "Create Capsule" form.
  2. User enters a title and message (rich text) and optionally uploads attachments (images, audio, video, PDF).
  3. User sets an unlock date or condition (specific date, anniversary, or trusted-contact trigger).
  4. User adds recipient(s) and selects delivery options (email/SMS/in-app).
  5. If client-side encryption is selected, the client generates a symmetric key and encrypts content locally; the key is stored per user policy.
  6. User confirms and saves the capsule.
  7. System returns confirmation and schedules a delivery job.
- Alternate Flows:
  - A1: Attachment exceeds allowed size → system prompts user to remove or upgrade plan.
  - A2: Invalid unlock date (in the past) → user corrected input.
- Postcondition: Capsule saved and scheduled; creator receives confirmation email.

## UC-02: Edit or Cancel Scheduled Capsule
- Actors: Registered User (Creator)
- Priority: High
- Precondition: Capsule exists and is not yet unlocked/delivered.
- Trigger: Creator selects "Edit" or "Cancel" on an existing capsule.
- Main Success Scenario:
  1. User opens the capsule and selects Edit.
  2. User changes content, attachments, recipients, or unlock date.
  3. User saves changes; system updates storage and reschedules delivery job.
  4. If cancel chosen, system marks capsule as cancelled and informs recipients/creator.
- Alternate Flows:
  - A1: Attempt to edit after capsule was delivered → system denies edits and offers archival copy.
- Postcondition: Capsule updated or cancelled; audit log updated.

## UC-03: Receive Unlocked Capsule
- Actors: Recipient, Creator (notified)
- Priority: High
- Precondition: Capsule reached unlock condition and delivery succeeded.
- Trigger: Scheduled job runs and marks capsule as deliverable.
- Main Success Scenario:
  1. Delivery job validates recipient identity (per configured verification level).
  2. System sends notification (email/SMS/in-app) to recipient with secure link.
  3. Recipient authenticates (if required) and accesses the capsule.
  4. Recipient views decrypted content in-app or downloads attachments via signed URL.
  5. System records delivery receipt and timestamp for audit.
- Alternate Flows:
  - A1: Recipient email bounces → system retries and escalates to Creator.
  - A2: Recipient fails verification → system offers manual verification steps (trusted contact, ID check).
- Postcondition: Delivery recorded; recipient access logged.

## UC-04: Trusted Contact Escrow Trigger
- Actors: Creator, Trusted Contact(s), Admin (optional)
- Priority: Medium
- Precondition: Creator has configured trusted contact(s) and escrow conditions.
- Trigger: Trusted contact verifies event (e.g., death confirmation) or time/condition met.
- Main Success Scenario:
  1. Trusted contact submits a verification request with required evidence.
  2. System routes request to verification workflow (automated checks + human review if required).
  3. Upon verification, system unlocks relevant capsules and schedules delivery.
  4. Notifications sent to recipients and creator's trusted contacts per policy.
- Alternate Flows:
  - A1: Dispute or insufficient evidence → system escalates to Admin or requests additional info.
- Postcondition: Capsules are delivered or held based on verification result; audit trail maintained.

## UC-05: Recover Lost Keys / Recovery Flow
- Actors: Creator, Trusted Contact, Support
- Priority: High (if E2E offered)
- Precondition: Creator used client-side encryption and lost access to keys/password.
- Trigger: Creator initiates recovery process.
- Main Success Scenario:
  1. Creator accesses recovery workflow and chooses an authorized recovery method (trusted contact, recovery phrase, or paid escrow).
  2. System validates recovery method and, if successful, restores access or re-encrypts capsule keys securely.
  3. Creator regains access and can manage scheduled capsules.
- Alternate Flows:
  - A1: Recovery fails due to insufficient verification → system denies access and warns about irrecoverability.
- Postcondition: Keys recovered or access permanently lost with proper warnings logged.

## UC-06: Admin Moderation & Legal Hold
- Actors: Admin, Support, Legal
- Priority: Medium
- Precondition: Admin user authenticated with elevated privileges.
- Trigger: Reported abuse, legal request, or internal policy enforcement.
- Main Success Scenario:
  1. Admin places a legal hold or flags a capsule for review.
  2. System prevents delivery while preserving data integrity and audit logs.
  3. Admin or Legal reviews content and coordinates action (release, delete, or escalate).
- Alternate Flows:
  - A1: Emergency release required by court order → admin follows legal workflow and documents chain of custody.
- Postcondition: Capsule status updated; legal/administrative actions recorded.

## UC-07: Search, Filter and Browse Capsules
- Actors: Creator, Admin
- Priority: Medium
- Precondition: User authenticated and authorized to view capsules.
- Trigger: User uses dashboard search or filters.
- Main Success Scenario:
  1. User enters search criteria (date range, status, recipient, keywords in title).
  2. System returns matching capsules with pagination and sort options.
  3. User can preview metadata and navigate to capsule details.
- Alternate Flows:
  - A1: Large result set → system recommends saved filters or suggests refinement.
- Postcondition: User locates desired capsules; access control enforced.

## UC-08: Billing & Plan Upgrade
- Actors: Creator (payer), Billing System
- Priority: Medium
- Precondition: User account exists and billing is enabled.
- Trigger: User exceeds quota or selects premium feature.
- Main Success Scenario:
  1. System prompts user to upgrade when upload/retention limits reached.
  2. User selects plan and enters payment details (handled by PCI-compliant provider).
  3. Billing system processes payment and updates account limits.
  4. Upgrade takes effect immediately; uploader can retry uploading attachments.
- Alternate Flows:
  - A1: Payment fails → system notifies user and offers retry or alternate payment.
- Postcondition: Account updated and usage limits adjusted.

## UC-09: Export & Portability
- Actors: Creator
- Priority: Low/Optional
- Precondition: User owns capsules and requests export.
- Trigger: User requests data export (for portability or legal reasons).
- Main Success Scenario:
  1. User requests export (metadata + attachments) via account settings.
  2. System prepares export package (encrypted or signed) and notifies user when ready.
  3. User downloads the package or requests delivery to a third-party storage.
- Alternate Flows:
  - A1: Large export requires queued processing → user informed of delay.
- Postcondition: Data exported in a portable format; audit recorded.

## UC-10: Scheduled Retry & Failure Handling
- Actors: System (workers), Support
- Priority: High
- Precondition: Delivery job attempted and failed (transient error).
- Trigger: Job failure due to transient network or provider issues.
- Main Success Scenario:
  1. Worker marks job failed and enqueues retries with exponential backoff.
  2. System notifies support/creator if retries exceed threshold.
  3. Support reviews logs and remediates if needed.
- Alternate Flows:
  - A1: Permanent failure (invalid recipient) → job marked failed and creator notified.
- Postcondition: Delivery either succeeds after retry or fails and is escalated.

---

### Notes on Prioritization & Implementation
- MVP must implement UC-01, UC-02, UC-03, UC-10 and basic billing UC-08 for paid tiers.
- UC-04 (Trusted Contact Escrow) and UC-05 (Key Recovery) are high business value but need careful security and legal design—plan for phased implementation.
- Admin flows (UC-06) and Export (UC-09) can follow after an initial beta.

---

Document prepared by: Project Documentation Team
Date: 2025-11-21
