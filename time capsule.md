# Time Capsule
A digital tool for storing letters, photos, or messages that unlock at future dates (e.g., graduation, anniversaries).

---

Table of Contents
1. Problem statement and overview
2. Feasibility study — Economic & Schedule
3. Feasibility study — Technical & Operational
4. Stakeholder identification (table)

---

1. Problem statement and overview
-------------------------------

1.1 Project Title  
Time Capsule — a secure web application to compose, store, and time‑lock digital messages, media and documents that are delivered/unlocked automatically at user‑specified future dates or events.

1.2 Problem Statement  
People want to save meaningful messages, photos and memories for themselves or others at a later date (for milestones like graduation, weddings, anniversaries, bereavement messages, or legacy notes). Existing solutions are fragmented (email drafts, consumer cloud storage) and often lack:
- automatic timed delivery
- strong privacy and integrity guarantees
- easy multi‑recipient scheduling
- expiry/retention control and legal compliance for legacy content

This results in missed opportunities to preserve intent, poor long‑term reliability, and privacy risks.

1.3 Overview & Objectives
- Provide a reliable, user‑friendly service to create and securely store messages, attachments and multimedia that unlock on scheduled dates or triggers.
- Support single or multiple recipients (immediate or deferred release).
- Ensure strong privacy: end‑to‑end encryption at rest and transit; controlled key management.
- Provide auditability and verifiable delivery receipts.
- Enable administrative controls for legal/legacy processes while respecting user privacy.
- Deliver as a responsive web application (desktop + mobile) and optional mobile apps.

1.4 Key Features (high level)
- Create letter/message with rich text and attachments (images/audio/video, PDFs).
- Set unlock date(s) and optional triggers (e.g., user death event via trusted contact verification, specific anniversary).
- Multi‑recipient scheduling and conditional delivery (e.g., only if recipient confirms identity).
- Strong privacy: client‑side encryption option, server‑side encrypted storage, per‑message keys.
- Tamper‑evidence: cryptographic hashes and signatures for content integrity.
- Notifications & reminders for creators and recipients (email, SMS, in‑app).
- Recovery & legacy options (trusted contacts, legal hold, escrow).
- Audit trail and delivery receipts.
- Admin dashboard (user management, compliance, moderation).

1.5 Success Criteria
- Core flows: compose → store → unlock/deliver work end‑to‑end in staging.
- 99% of scheduled deliveries succeed on first attempt over a 30‑day test.
- User signup → create & schedule a capsule within 5 minutes for new users.
- Security review: no critical findings; high severity issues remediated.
- Performance: typical retrieval latency < 300ms for unlocked content.

---

2. Feasibility study — Economic & Schedule
------------------------------------------

2.1 High‑level Cost Estimate (initial MVP)
- Personnel (3 months MVP)
  - Full‑stack developer(s) (2 × mid‑level): $30k – $45k
  - Backend engineer (1): $12k – $20k
  - UI/UX designer (part‑time): $5k – $8k
  - QA / tester (part‑time): $4k – $7k
  - DevOps (part‑time / contractor): $3k – $6k
- Infrastructure (3 months + initial scale)
  - Cloud hosting (app + DB): $300–$1,200 / month
  - Storage (object storage for attachments): $50–$500 / month (varies by retention)
  - Email/SMS provider (notifications): $50–$500 / month
  - CDN, backups, monitoring: $100–$500 / month
- Tools & licenses
  - Third‑party encryption library, compliance audit, legal: $1k–$5k
- Contingency (~15%): included in totals

Estimated MVP budget (conservative): $60k – $95k (3 months)  
Estimated monthly operational: $600 – $2,500 (depending on scale/storage).

2.2 Benefit / Value Proposition
- Subscription revenue (freemium + paid tiers for attachments size, multi‑recipient, E2E encryption).
- One‑time paid features (notarization / legal escrow).
- Institutional/licensing for universities, legal firms, and event planners.
- Emotional / legacy value increases willingness to pay for guaranteed delivery and privacy.

2.3 Schedule & Milestones (MVP — 12 weeks)
- Week 0: Project kickoff, requirements, UX sketches
- Weeks 1–2: Core backend APIs (user/auth), DB schemas, storage integration
- Weeks 3–4: Compose UI, file upload, encryption model design
- Week 5: Scheduling engine (cron/queue), trial delivery flow
- Week 6: Recipient delivery flows (email/SMS/in‑app)
- Weeks 7–8: Security & encryption integration; key management
- Week 9: Admin dashboard, logging, audit trails
- Week 10: QA, performance tuning, backups
- Week 11: Beta release, user testing, feedback loop
- Week 12: Final fixes & launch

2.4 Key Dependencies & Assumptions
- Cloud provider availability (AWS/GCP/Azure) for storage and compute.
- Third‑party mail/SMS provider account.
- Legal counsel availability for privacy / data retention policies.
- User acceptance testing participants.

2.5 Financial Risks & Mitigation
- Storage costs growth: mitigate via tiered retention policies and paid tiers.
- Low conversion from free to paid: mitigate with clear premium features and enterprise sales channel.
- Unexpected legal costs: budget contingency and early consult with counsel.

---

3. Feasibility study — Technical & Operational
-----------------------------------------------

3.1 Architectural Overview
- Client: React + TypeScript SPA (or Next.js) — responsive UI.
- Backend: Node.js / TypeScript (Express / NestJS) or serverless functions.
- Data store:
  - Relational DB (Postgres) for metadata (users, schedules, recipients).
  - Object storage (S3 or equivalent) for attachments.
- Scheduling: background worker (BullMQ / Redis queues or cloud scheduler) to execute unlock/delivery jobs.
- Messaging: transactional email (SendGrid / SES) + SMS provider (Twilio) + in‑app notifications (WebPush).
- Optional: end‑to‑end encryption: client side generates per‑capsule symmetric key, encrypted with recipient public keys or stored in server‑side KMS with access controls.
- Monitoring: Prometheus / Grafana or cloud monitoring service; error tracking with Sentry.
- CI/CD: GitHub Actions for build/test/deploy pipelines.

3.2 Technical Feasibility — Key Considerations
- Scheduling accuracy & reliability:
  - Use persistent job queue with retries, backoff and dead‑letter queue.
  - Ensure timezone handling and DST awareness.
- Data privacy & encryption:
  - Encrypt attachments at rest (server side) and ideally support optional client‑side encryption.
  - Use HTTPS everywhere, TLS 1.2+.
  - Key management: cloud KMS or hardware security module for server‑side keys; consider zero‑knowledge model for client‑side keys.
- Scalability:
  - Store metadata in RDBMS; scale workers horizontally.
  - Use object storage for large media, with signed URLs for access.
- Availability:
  - Multi‑AZ deployment or cloud provider managed services.
  - Regular backups and test restores for DB and object store metadata.
- Integrity & non‑repudiation:
  - Hash content and store checksum for tamper detection.
  - Optionally notarize hashes on blockchain or third‑party notarization service (paid feature).

3.3 Operational Feasibility — Processes & People
- Release & deployment:
  - CI/CD pipelines, staging + production environments.
  - Canary deployments for scheduling/delivery changes.
- Monitoring & SLA:
  - Monitor job queue length, delivery success rate, storage costs.
  - Target SLO: 99.9% successful scheduled deliveries within window.
- Support & moderation:
  - Support ticket workflow for failed deliveries and user recovery.
  - Admin tools for moderation and legal holds (with strict audit and minimal access).
- Data retention & compliance:
  - Implement retention policies and user controls for deletion/expiry.
  - Compliance with GDPR, CCPA: data export, right to be forgotten flow, consent capture.
- Incident response:
  - Runbooks for failed deliveries, security incidents, and backup restores.

3.4 Technical Risks & Mitigation
- Risk: Key loss for client‑side E2E encryption → Mitigate: optional escrow with user consent, recovery via trusted contacts, and clear warnings about irrecoverability.
- Risk: Large/long‑term storage costs → Mitigate: tiered archival, TTL, paid tiers for long retention.
- Risk: Abuse (malicious or illegal content) → Mitigate: Terms of Service, reporting and legal compliance procedures, automated virus/malware scanning for attachments.
- Risk: Time‑dependent deliveries failing (job queue outage) → Mitigate: durable queues, multiple worker nodes, health checks and alerting.

3.5 Recommended Tech Stack (example)
- Frontend: React + TypeScript, Tailwind CSS / Chakra UI
- Backend: Node.js + TypeScript, NestJS or Express
- DB: PostgreSQL (hosted) for relational metadata
- Queue/worker: Redis + BullMQ or cloud Pub/Sub + Cloud Functions
- Object storage: AWS S3 / DigitalOcean Spaces / GCS
- Key management: AWS KMS or Google Cloud KMS; optional local WebCrypto for client‑side
- Auth: OAuth2 / JWT + optional 2FA
- CI/CD: GitHub Actions
- Monitoring: Sentry, CloudWatch/Stackdriver, Grafana

3.6 Operational Checklist for Launch
- Conduct security audit & penetration testing.
- Establish legal terms, privacy policy and age restrictions.
- Setup backups and tested restore procedures.
- Create runbooks for key failure scenarios (delivery retry, DB restore).
- Prepare onboarding docs and support scripts.

---

4. Stakeholder identification (table format)
---------------------------------------------

| Stakeholder | Role / Title | Interest / Concerns | Influence | Responsibilities | Communication cadence |
|-------------|--------------|---------------------:|----------:|------------------|----------------------|
| End Users (Creators) | Users who create capsules | Privacy, reliability of delivery, easy UX | Medium | Create content, set unlock date, manage recipients | In‑app messages, email, help articles |
| Recipients | Users who receive unlocked content | Accessability, identity verification, privacy | Low | Receive messages, verify identity | Notification (email/SMS), in‑app |
| Product Owner / Sponsor | Project sponsor / owner | ROI, product adoption, legal risk | High | Prioritize features, budget approvals | Weekly status / milestone reviews |
| Development Team | Frontend / Backend / QA | Clear requirements, stable infra | High | Implement features, tests, deployments | Daily standups, sprint planning |
| DevOps / Platform | Infrastructure & deployments | Reliability, cost, backups | High | Deploy, monitor, scale infrastructure | On‑call, weekly sync |
| Security & Compliance | Legal / InfoSec | Data protection, regulatory compliance | High | Security policies, audits, compliance validation | As‑required + monthly reviews |
| Support & Ops | Customer support | User issues, incident handling | Medium | Handle tickets, escalate issues | Daily triage |
| Legal Counsel | Legal advisor | Data retention, admissibility, ToS | High | Draft policies, handle legal requests | Ad‑hoc / milestones |
| Marketing & Sales | Growth / Partnerships | User acquisition, monetization | Medium | Go‑to‑market, pricing strategy | Weekly / campaign |
| Archived Custodians / Executors | Trusted contacts, executors | Ensure correct release on death/trigger events | Low | Verify and request release under policy | Ad‑hoc, via secure process |
| Investors / Board | Funding & oversight | ROI, growth metrics | High | Funding decisions, oversight | Monthly / quarterly reports |

---

Appendices & Recommendations (unique functions to make the product stand out)
-------------------------------------------------------------------------------

Recommended unique functions (value‑add)
- Verifiable Delivery Receipts: cryptographically sign a delivery receipt and allow creators to verify that the exact content delivered matches what was stored (hash signing with timestamp).
- Trusted Contact Escrow: allow creators to specify trusted contacts who can confirm certain life events (with staged verification) to enable conditional unlocking (eg. death escrow process).
- Time Capsule Tiers:
  - Free: basic text + small attachments, limited retention.
  - Premium: larger storage, multiple recipients, scheduled reminders, notarization.
  - Institutional: bulk scheduling, branded UI, SLAs for universities & law firms.
- Biometric / Multi‑factor Recipient Verification: optionally require stronger recipient verification for sensitive content.
- Notarization / Blockchain anchoring (optional paid feature): publish content hashes to an immutable ledger for later verification.
- Multimedia Smart Compression and Transcoding: optimize stored media for cost and delivery; generate thumbnails/previews.
- “Future Self” AI Assistant (optional): help users draft messages using prompts or suggest personalized templates for different types of capsules.
- Group Capsules: allow multiple creators to collaborate on a single capsule (e.g., class yearbook).
- Expiry & Legal Hold Controls: creators choose automatic deletion after unlock or persistent archival; admins can place legal hold if required.
- Privacy Preserving Analytics: aggregate engagement metrics without exposing personal content.

Recommended MVP feature list (minimum to launch)
- User signup/login, email verification
- Compose capsule (text + attachments)
- Schedule unlock date and set recipients
- Reliable scheduling & delivery engine with retries
- Basic encryption at rest and in transit
- In‑app notifications & email delivery
- Admin panel for monitoring and simple interventions
- Billing / subscription plumbing for paid tiers

Risks recap & next steps
- Key technical risk: ensuring reliable scheduled delivery at scale; mitigate by robust job queue design and monitoring.
- Privacy risk: key management and recovery strategy; define and document user choices and warnings.
- Business risk: monetization and storage costs; implement tiered retention and pricing early.

Next recommended actions (short)
1. Finalize product requirements and security model (E2E vs server‑side encryption).
2. Build a 12‑week delivery plan and onboard developers.
3. Implement an MVP with core scheduling + delivery + basic encryption.
4. Conduct security review and limited beta with real users.

---

Document prepared by: Project Documentation Team (recommended)
Date: 2025-11-21