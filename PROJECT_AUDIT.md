# Life Connect project audit

Audit performed from the checked-in workspace on 2026-10-31. The repository root has no `.git` directory, so local Git status/history cannot be inspected. No credentials from `backend/.env` were read. Package manifests were inspected; no dependency installation is indicated by the findings.

## Phase 1 findings

This is an Express 5/Mongoose API and React 19/Vite frontend. The backend mounts auth, admin, blood requests, donor search, inventory, SOS, camps, issuance, commitments, and analytics endpoints. The frontend has Home, Register/Login, public donor search, blood requests, inventory (used as the Hospitals page), SOS, camps, issuance log, donor tracking, analytics, role dashboard, and separate admin portal. There is no notification page or notification API, no standalone hospital directory/model, no profile or request owner-management interface, and no generic user/admin API route beyond admin record management.

Authentication currently uses bcryptjs and a 30-day JWT with a hard-coded development fallback secret. Admin login is a separate environment-variable credential flow (not an Admin model), but admin requests are distinguished via JWT role/username in middleware. Frontend tokens are stored in localStorage. `protect` reloads user accounts from MongoDB and removes password from request user, but trusts the admin JWT claim without a DB principal. User registration accepts donor, recipient, and hospital roles; admin registration is blocked. Password hashes are removed from explicit auth responses and most user lists.

Key verified gaps and defects:

- Donor controller uses ES module syntax in a CommonJS backend and imports a `.js` path, likely preventing the server from starting when donor routes load.
- Public signup accepts caller-selected `hospital` role; backend only rejects `admin`. `User` phone is not unique, phone is not normalized, name/city/phone validation is minimal, and registration permits roles inconsistent with the intended candidate roles.
- JWT fallback secret is hard-coded in both token generation and auth middleware; no rate limiting exists. Morgan logs all requests (not bodies, but can log query strings); generic errors return stack traces outside production.
- Admin account is not backed by User, but middleware's admin shortcut treats a verified token with `{role: admin, username}` as privileged. The token is properly signed using configured JWT secret and admin login requires env credentials.
- Blood request listing exposes patient name and phone publicly. Request owner read/update/cancel and request status transition endpoints are absent. Create request validates only a few fields and has no bounded pagination.
- Hospital/camp/inventory/issuance write permissions are inconsistent: camps and inventory creation rely on controllers for role checks; camp creation currently permits any logged-in account; camp delete checks ownership but no role. Inventory update/delete controllers exist but routes are not mounted. Inventory create trusts caller supplied facility fields. SOS list reveals all alerts; resolving only checks owner (not role) and status transitions are not constrained.
- Commitments provide an existing donor-response/donation-progress record and duplicate precheck, but have no DB unique constraint, only donor/hospital role values from mutually exclusive account roles, missing location match for requests, donor commitment eligibility is only checked for SOS, and status changes allow invalid/repeated transitions. Request donor response references its creator as hospital even where that creator is a recipient.
- Issuance reads/writes are protected only by authentication, not hospital role; stock deductions and issuance creation are non-transactional, ignore expired stock, and delete zero inventory records. Patient details are broadly visible to any signed-in user only indirectly? Current GET correctly filters by authenticated user ID, but role is not checked.
- Admin generic record update is allowlisted but users can be promoted to donor/recipient/hospital and malformed IDs surface as 400; user delete can orphan related records. Admin dashboard caps lists but is not paginated.
- Frontend's requested core features mostly exist but there is no Notifications feature, Hospital model/directory, or explicit create-request page separate from modal. RoleDashboard and AdminPortal are functional API-backed views. The existing `Donation` interaction is the donor commitment tracking workflow. UI role checks are inconsistent, and token role uses `localStorage` client state as expected for presentation only.
- `userRoutes.js` is a placeholder and is not mounted. Redis config is empty and unused. No backend tests or test/lint scripts are declared. Frontend has build/lint scripts.

## Phase 2: Model gap matrix

| Model | Existing? | Current functionality | Missing fields/features | Required changes / classification |
|---|---|---|---|---|
| User | Yes | Name/email/password hash/role/blood group/city/phone, timestamps, bcrypt save hook and comparison | phone uniqueness/normalization, stronger validation; role selection security; safe serialization convention | **Exists but requires enhancement.** Preserve legacy `donor`, `recipient`, and `hospital` roles because they drive current UI and workflows; document them as product roles, not separate auth systems. Public signup must not create hospital/admin accounts. Consider unique sparse normalized phone only after existing-data duplicate audit. |
| BloodRequest | Yes | Creator ref, patient, blood group/units, hospital label, city/contact, urgency, Pending/Fulfilled, timestamps | enum/range validation/indexes; optional hospital ref; owner list/update/cancel; status transitions; linked donor responses; pagination | **Exists but requires enhancement.** Preserve `user` field and existing status values. Add safe ownership operations and validation; do not rename fields. |
| Hospital | No | Facility data duplicated in User and inventory/camp/request/SOS docs | Public independently managed hospital listing/details, address and verification; current hospital user account not a verified directory | **Missing and needs creation only if implementing requested public hospital directory.** Hospital staff auth is not required; hospital account remains current product role. Directory can be public; only admins manage records. Avoid inferring verified facilities from User role. |
| BloodCamp | `Camp` exists | Title, venue, city, date/time, contact, description, organizer User ref/name; list/create/delete | required length/date/time validation, filters/pagination, edit workflow, authorization | **Exists but requires enhancement.** Keep `Camp` collection/model to preserve data; add validation and admin/organizer-safe mutations. |
| Notification | No | None. Commitments are not recipient notifications. | recipient/type/message/read timestamps/references, deduplication, private list/read API, trigger workflow | **Missing and needs creation** to support donor response prompts and workflow updates. |
| Donation | No named model; `DonorCommitment` overlaps | Donor, hospital, blood group, reference, accepted/on-way/donated/cancelled status | request-specific relation semantics, donor status timestamps, robust state machine and uniqueness; currently mixes SOS/general responses and donation | **Exists but requires enhancement via `DonorCommitment`; do not create duplicate Donation model.** Treat as response/progress record and retain model/collection/API for compatibility; add status validation/uniqueness and clarify it is not medical approval. |
| Inventory | Yes | Facility user ref, group, units, city/contact, batch/expiry | role/ownership validation, pagination/filtering, expired-stock handling, unique batch semantics | **Exists but requires enhancement** where write API/issuance workflow gaps require it. |
| PatientIssuance | Yes | Facility ref, limited patient details, group/units, doctor, date/reason | role protection and transactional stock deduction; privacy, validation | **Exists but requires enhancement** for hospital-only route access and consistency. |
| SOSAlert | Yes | Facility ref/label, group/units/city/contact/message/status | lifecycle validation, safe public fields, pagination, role/owner/admin constraints | **Exists but requires enhancement.** |
| Admin | No | Admin managed by environment credentials and signed JWT | none if the documented deployment model remains intentional | **Not required.** Existing environment-backed administrator avoids duplicate identity storage; strengthen middleware and require configured secrets. |
| Donor response / availability | No separate model; `DonorCommitment` performs response role | Captures donor response to request/SOS and progress | per-request response semantics and duplicate index; existing form does not request availability at signup | **Not required as separate model.** Enhance DonorCommitment. Availability remains explicit response, never inferred from registration. |
| Audit log | No | Admin dashboard and app logs only | change history | **Not required for current workflows.** Add only if future compliance/traceability requirement is defined. |

## Frontend page/component gap analysis

| Requirement | Existing implementation | Gap |
|---|---|---|
| Home | `Home.jsx`, public marketing/navigation | Exists; static emergency ticker copy is not live API data. |
| Signup/Login | `Register.jsx`, `Login.jsx`, `AuthContext` | Exists; role choices expose hospital signup; errors use alerts/logging; localStorage session. |
| User dashboard | `RoleDashboard.jsx` | Exists; donor/hospital/recipient specific panels, but request ownership management and notifications absent. |
| Hospitals | `Inventory.jsx` at `/inventory` | Blood stock public listing/search; not a hospital directory/detail page. |
| Donation | `DonorTracking.jsx`, commitments, request/SOS response buttons | Exists but no explicit response availability lifecycle and transitions not robust. |
| Create Blood Request | Modal in `BloodRequests.jsx` | Exists, but owner view/cancel/status completion absent; currently request form can be opened logged out. |
| Blood Camps | `DonationCamps.jsx` | Exists; public listing and hospital account create/owner delete; no edit/filter/detail. |
| Notifications | None | Missing page/nav/API integration. |
| Admin Dashboard | `AdminPortal.jsx` | Exists and uses API, separate admin login; not a User-role admin page. |

## API and authorization audit matrix (current routes)

| Method/path | Current access | Required policy / finding |
|---|---|---|
| POST `/api/auth/register`, `/login` | Public | Public user registration/login; restrict public role choices, validate inputs, rate limit auth. |
| POST `/api/admin/auth/login` | Public credentials | Public login endpoint with env credential verification and rate limit; rest of `/admin` admin-only. |
| GET `/api/admin/dashboard`, PATCH/DELETE `/api/admin/records/:collection/:id` | Admin middleware | Admin-only; retain field allowlist, avoid role escalation, safe delete semantics and validate IDs. |
| GET `/api/requests` | Public | Public paginated listing with privacy-minimized projection. |
| POST `/api/requests` | Authenticated non-admin | Create as caller; validate fields; admin excluded. Add owner-only list/edit/cancel and authorized status changes. |
| GET `/api/donors` | Public | Public bounded directory; minimize exposed PII and make explicit availability distinctions. |
| GET `/api/inventory` | Public | Public paginated/filterable stock summary. |
| POST `/api/inventory` | Any authenticated user | Hospital/admin only; derive owner and facility identity from authenticated account. |
| PUT/DELETE `/api/inventory/:id` | Not mounted | Owner-hospital/admin; allowlisted fields. |
| GET `/api/sos` | Public | Public active-alert summary, bounded list. |
| POST `/api/sos` | Auth + controller hospital check | Hospital/admin only, validate and derive owner. |
| PUT `/api/sos/:id/resolve` | Auth + owner check | Owner hospital/admin and allowed transition only. |
| GET `/api/camps` | Public | Public, bounded/filterable. |
| POST `/api/camps` | Any auth currently | Authenticated User or approved Hospital organizer; derive organizer; validate date/time. |
| DELETE `/api/camps/:id` | Auth + owner only | User or approved Hospital organizer; owner-scoped delete. |
| GET/POST `/api/commitments`, PUT `/:id/status` | Auth + role/owner checks | User response create; User/Hospital scoped reads; explicit transition matrix and linked resource ownership. |
| GET/POST `/api/issuance` | Any auth; GET user-filtered | Hospital-only; GET own hospital; POST transaction-safe inventory deduction. |
| GET `/api/analytics/dashboard` | Approved Hospital only | Hospital-scoped operational analytics. |
| `/api/users` | Not mounted placeholder | Not an active endpoint. Profile operations are missing. |
| Notification endpoints | Missing | Authenticated recipient-only list/read; admin moderation should not disclose payload by default. |

## Relationship overview

- `User` is referenced by `BloodRequest.user`, `Camp.hospital`, `Inventory.hospital`, `SOSAlert.hospital`, `DonorCommitment.donor/hospital`, and `PatientIssuance.hospital`.
- `DonorCommitment.referenceId` is polymorphic by `referenceType` (`SOS`, `General`, `Camp`), but currently has no `refPath`; General points to BloodRequest and SOS points to SOSAlert. Camp is declared but not currently supported by create logic.
- `BloodRequest` has no direct response/donation array; references are discoverable from commitments.
- No Hospital entity exists; hospital accounts are User documents and duplicate facility names/contact across records.
- No Notification relation exists. No cascade/transaction policy exists for related deletions.

## Prioritized implementation plan

1. Restore backend startup and close security boundaries: CommonJS donor controller, remove fallback JWT secret, tighten public role registration, add reusable role checks, validation/error handling, request limits, and endpoint ownership.
2. Make core flows correct: request privacy/ownership/status, commitment idempotency and transitions, hospital/camp/inventory/issuance permissions, stock transaction consistency.
3. Add only justified domain functionality: Hospital directory if a public facilities page is desired, Notification model/workflow for donor prompts and state updates; preserve Camp and DonorCommitment rather than duplicate them.
4. Complete frontend missing interactions: notification inbox, hospital directory, request management, with existing components/styles.
5. Add route matrix and migration notes here; run declared frontend build/lint and backend smoke/static checks. No backend test runner is currently configured.

## Compatibility and data risks

- Existing role values (`donor`, `recipient`, `hospital`, `admin`) are embedded in stored records, filters, and UI. A direct role enum migration to `user/admin` would break existing accounts and workflows. This audit retains the current roles and blocks public hospital/admin signup; future donor+recipient dual capability should be modeled as capabilities only with a planned migration.
- Existing `Camp` and `DonorCommitment` collections must stay named and fields retained. `Donation` must not be created as a second copy of commitment data.
- Adding unique phone or compound donor/reference indexes can fail on existing duplicates. First normalize/deduplicate via a reviewed migration; avoid destructive auto-cleanup.
- Hospital directory introduces independent facility records; do not silently infer verification from hospital-role accounts. Existing hospital references remain User refs.
- Transaction support requires MongoDB replica set; deployments without it need a safe conditional strategy or compensating rollback.
- JWT fallback removal requires `JWT_SECRET` to be configured in every environment; missing config should fail closed.

## Implementation completed after the audit

- Fixed backend startup by converting donor search to the existing CommonJS module style.
- Removed the hard-coded JWT secret fallback; protected routes now fail closed when JWT configuration is absent. Added auth endpoint rate limits, small JSON body limit, reduced request logging, and removed error stack traces from API responses.
- Tightened account registration to donor/recipient roles, normalized email, validated core fields, and kept password hashes excluded from normal queries and serialization. The existing hospital account role remains for established authorized accounts and staff workflows, but cannot be created by public signup. Phone normalization was added, but phone uniqueness was not imposed without a duplicate-data audit/migration.
- Added a reusable role middleware and enforced hospital role on inventory, camps, SOS, and issuance writes/reads. Restored the existing inventory update/delete endpoints and allowlisted updates/derived ownership.
- Added owner-scoped blood request listing/edit/cancel APIs, request validation, paginated active requests, and donor match notifications by exact group and city. Blood group/location are discovery filters only and never establish clinical compatibility or eligibility.
- Enhanced existing `DonorCommitment` with donor/reference unique index and lifecycle timestamps, explicit allowed status transitions, and notification updates. Kept the existing model/API instead of creating a second Donation model.
- Added `Notification` with recipient-only list/read APIs and request/response triggers.
- Added `Hospital` as a public directory record, public list/detail/search APIs, and admin-only create/edit/delete. Added directory and notification pages; exposed hospital CRUD/verification in the admin portal.
- Enhanced `Camp` validation/indexing and bounded camp listing; retained its model/collection.
- Issuance now considers only non-expired stock, decrements batches atomically, and compensates stock if log creation fails. MongoDB transactions were not enabled because the deployment's replica-set support is unknown.
- Frontend gained Hospitals and Notifications routes/navigation; donor search text now distinguishes registration from confirmed availability. Local auth session parsing handles malformed stored data.

### Current authorization matrix

| Method/path | Current policy |
|---|---|
| POST `/api/auth/register`, `/login` | Public, rate limited; signup donor/recipient only. |
| POST `/api/admin/auth/login` | Public credentials, rate limited. |
| GET `/api/admin/dashboard`, PATCH/DELETE `/api/admin/records/:collection/:id` | Signed environment-backed admin token only. |
| GET `/api/requests` | Public, pending requests, max 50 per page. |
| POST `/api/requests` | Authenticated non-admin; creator always taken from token. |
| GET `/api/requests/mine` | Authenticated; own records only. |
| PATCH/DELETE `/api/requests/:id` | Authenticated owner, pending only; updates allowlisted and cancel is soft status change. |
| GET `/api/donors` | Public, bounded list; name/group/city only. Availability is not implied. |
| GET `/api/inventory` | Public, bounded/filterable stock list. |
| POST/PUT/DELETE `/api/inventory[/:id]` | Authenticated hospital; writes scoped to authenticated hospital. |
| GET `/api/sos` | Public alerts listing (legacy unbounded response remains to be bounded). |
| POST/PUT `/api/sos[/:id]/resolve` | Authenticated hospital; resolve checks owner. |
| GET `/api/camps` | Public, bounded/filterable. |
| POST/DELETE `/api/camps[/:id]` | Authenticated User or approved Hospital organizer; deletion checks owner. |
| GET/POST `/api/commitments` | Authenticated User creates own response; User sees own records, approved Hospital sees responses linked to own account. |
| PUT `/api/commitments/:id/status` | Related User/approved Hospital only; enforced transition table. |
| GET/POST `/api/issuance` | Authenticated hospital; own records/stock only. |
| GET `/api/analytics/dashboard` | Approved Hospital only; hospital-scoped operational data. |
| GET `/api/hospitals`, `/api/hospitals/:id` | Public, paginated listing/detail. |
| POST/PATCH/DELETE `/api/hospitals[/:id]` | Admin token only. |
| GET/PATCH `/api/notifications`, `/api/notifications/:id/read` | Authenticated; recipient-scoped (read-all is PATCH `/read-all`). |

### Verification performed

- `npm run build`: passed after implementation.
- `npm run lint`: exited successfully; Oxlint reported warnings (mostly pre-existing effect dependency/state-in-effect and unused imports in existing screens). No lint errors blocked the run.
- `node --check` on every backend JavaScript file: passed.
- `node -e "require('./backend/src/app')"`: passed, confirming route/controller modules load together.
- No backend or frontend test script/test suite is configured in the package manifests. No live database integration or endpoint tests were run because that would require a configured MongoDB service and isolated test database; no production data or credentials were used.

### Remaining limitations and migration actions

- Existing collection data was not inspected because no database connection was used. Before deploying the new donor/reference unique index, check and resolve duplicate `DonorCommitment` records with a reviewed migration. Likewise, phone uniqueness remains unenforced pending duplicate audit.
- Existing JWTs signed with the former fallback secret will be rejected; configure a strong `JWT_SECRET` before rollout and require users to log in again if that key changes.
- Existing hospital accounts remain `User` records; public Hospital directory entries are separate and are never auto-verified from account role. Admins must create listings and explicitly mark verification.
- SOS list remains a legacy public endpoint and should receive pagination/projection before large-scale deployment. Public blood request responses include patient label and contact phone to preserve the current donor coordination UI; assess whether that visibility matches local privacy requirements.
- Camp edit is not exposed in the current UI/API; organizers can create and delete their own camps. Request owner editing is implemented at the API level but the existing UI still only creates requests.
- Notification delivery is in-app only; no email/SMS provider is configured. Matching notifications are exact blood group and city criteria for discovery and availability confirmation only.
- Hospital directory creation/edit/delete is available in the admin portal; no hospital staff account is assumed by this directory.
- No changes were pushed to GitHub. This workspace does not contain `.git` metadata, so branch/diff state could not be inspected.

## Role and dashboard correction

The registration flow was subsequently aligned to the requested account model:

- New signup choices are `User` and `Hospital account`; Admin remains on `/admin` and is never a public signup choice.
- A User account can request blood, respond to donation requests, and organize camps. Donor availability is still confirmed only by an explicit response.
- Hospital applications are stored as `role: user`, `requestedRole: hospital`, and `approvalStatus: pending`. Admin approval promotes the account to `hospital`; rejection leaves it as a User. Hospital APIs require both Hospital role and approved status.
- The User dashboard combines the donor and request use cases; the Hospital dashboard retains hospital operations.
- `GET /api/auth/me` reloads database-backed role/approval state after a page refresh.
- `backend/scripts/migrate-user-roles.js` defaults to dry-run and requires both `--apply` and `--backup-confirmed` to write. It requires `MONGO_URI` in the invoking environment and deliberately does not load `backend/.env`.
- Added `npm test` role and middleware tests. Existing `donor`/`recipient` records must be migrated before deploying the narrower Mongoose role enum; Hospital records are marked approved by the migration.
- Verified the migration against a fresh temporary MongoDB database: dry-run found two legacy roles and one legacy Hospital, the backed-up apply changed those counts as expected, and a related request retained its original User reference. The application's configured database was not used.
