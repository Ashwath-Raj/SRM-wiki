# 02_DATA_CLOUD_ONBOARDING.md
# SRM AP Information Navigator — Data Pipeline + Google Cloud + Gemini Onboarding

**Status:** Pre-build implementation contract  
**Version:** v1.0  
**Build target:** 3-hour hackathon MVP  
**Primary owner:** Member C for cloud; Member A for data; Member B for AI integration  
**Audience:** All 3 team members  
**Depends on:** `00_START_HERE.md`, `01_PROJECT_PLAN.md`

---

# 1. Purpose

This document answers four practical questions before implementation begins:

1. **How do we turn the SRM AP public web ecosystem into usable application data?**
2. **How does the team get a shared Google Cloud environment?**
3. **How do we obtain and safely use Gemini API keys?**
4. **How do we get the application deployed quickly without blocking the other two members?**

The operating principle is:

> **Cloud should remove friction, not become a second project.**

For the three-hour MVP, the preferred architecture is intentionally small:

```text
SRM AP public web
      ↓
Crawler / parser
      ↓
Normalized resources
      ↓
Structured DB + vector index
      ↓
Backend
      ↓
Gemini
      ↓
Navigation response
      ↓
Cloud Run deployment
```

---

# 2. Recommended Cloud Strategy

For this hackathon, use:

```text
Gemini API
    +
Google Cloud project
    +
Secret Manager
    +
Cloud Run
    +
Artifact Registry / source deployment
```

### Why this setup

It gives the team:

- a public deployment URL,
- a backend that can keep the Gemini key server-side,
- a simple container deployment model,
- a place to store the production secret,
- a path to later add other Google Cloud services.

Google's current Gemini documentation recommends treating API keys like passwords, keeping them out of source control and client-side production code, and using Secret Manager for production secrets. citehttps://ai.google.dev/gemini-api/docs/api-keyturn130332search0

Cloud Run can deploy a containerized application and expose a service URL; Google also supports deploying directly from source for supported workflows. citeturn560938search1turn676480search3

---

# 3. Important 2026 Gemini API-Key Requirement

The team should **not blindly use an old unrestricted Gemini API key tutorial**.

Google's current key documentation states that:

- new API keys created in Google AI Studio are created as auth keys by default starting May 28, 2026,
- unrestricted standard keys are being rejected,
- Gemini API rejects standard keys from September 2026,
- API keys should be treated like passwords,
- production web/mobile applications should not expose Gemini keys client-side.

Therefore:

> **Create/use a current supported Gemini authentication key and keep it on the backend.**

Source: Google's current Gemini API key guidance. citeturn130332search0

---

# 4. Cloud Ownership Model

One person should act as the temporary **Cloud Owner**.

Recommended:

```text
Member C
└── Cloud Owner / deployment owner
```

Member C handles:

- Google Cloud project,
- billing/settings if needed,
- Secret Manager,
- Cloud Run,
- deployment,
- service account,
- production environment.

### Important

Member C does **not** become the only person capable of running the application.

The rest of the team should be able to:

```text
git clone
↓
install dependencies
↓
set GEMINI_API_KEY
↓
run locally
```

No one should need Member C's actual key.

---

# 5. Google Account Setup

Before implementation:

### Member C

1. Sign in to the Google account that will own the hackathon project.
2. Open Google Cloud Console.
3. Create or select a dedicated project.
4. Record:
   - project ID,
   - project number,
   - project name.

Use a dedicated project rather than attaching the prototype to an unrelated personal production project.

---

# 6. Recommended Project Naming

Use something simple.

Example:

```text
Project name:
SRM AP Information Navigator

Possible project ID:
srm-ap-navigator-2026
```

Project IDs are globally constrained, so use a variation if already taken.

Do not waste time trying to get a perfect name.

---

# 7. Google Cloud APIs / Services

For the recommended deployment path, the team should expect to use:

```text
Cloud Run
Artifact Registry
Secret Manager
Cloud Build
```

Gemini API access is handled through the Gemini API / AI Studio key path for this MVP.

A minimal enablement command pattern is:

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com
```

If the CLI asks to enable additional dependencies during deployment, allow them when appropriate.

Do not enable a huge list of Google services just because they exist.

---

# 8. Install Google Cloud CLI

On the deployment machine, install the current Google Cloud CLI.

Then:

```bash
gcloud --version
```

Authenticate:

```bash
gcloud auth login
```

Initialize/configure the working project:

```bash
gcloud config set project YOUR_PROJECT_ID
```

Verify:

```bash
gcloud config get-value project
```

Expected:

```text
YOUR_PROJECT_ID
```

---

# 9. Optional gcloud Initialization

If this is the first time the machine is using gcloud:

```bash
gcloud init
```

Follow the browser authentication flow.

After initialization:

```bash
gcloud auth list
gcloud projects list
```

The active account and active project must be obvious before continuing.

---

# 10. Team Cloud Variables

Create a non-secret team configuration document or `.env.example`:

```env
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
GOOGLE_CLOUD_REGION=YOUR_REGION

GEMINI_API_KEY=

SERVICE_NAME=srm-ap-navigator
ARTIFACT_REPOSITORY=srm-ap
```

Only variable names and non-secret identifiers belong in `.env.example`.

Never put the actual key in Git.

---

# 11. Gemini API Key — Fastest MVP Path

The fastest implementation path is the **Gemini API via Google AI Studio** using the current Google GenAI SDK.

Google's current quickstart provides API-key setup through Google AI Studio and recommends the `google-genai` package for Python. citeturn560938search4turn676480search1

### Flow

```text
Google AI Studio
      ↓
API Keys
      ↓
Create supported authentication key
      ↓
Associate with intended project
      ↓
Store locally only for development
      ↓
Store in Secret Manager for deployment
```

---

# 12. Obtain a Gemini Key

Open the official Gemini API / AI Studio tooling:

```text
https://aistudio.google.com/
```

Go to the API key management area.

Create a new Gemini API key.

Google's current documentation notes that every Gemini API key is associated with a Google Cloud project. citeturn130332search0

### Record only:

```text
Project ID
Key label/name
Which developer owns the local key
```

Do **not** put the actual key into the project documentation.

---

# 13. Team Key Strategy

Do not send one production key through WhatsApp/Discord/Git.

Recommended:

```text
Member A local development
→ Member A's own development key

Member B local development
→ Member B's own development key

Member C local development
→ Member C's own development key

Production
→ One production secret in Google Secret Manager
```

This keeps local credentials separate from deployment credentials.

However:

> **Do not create or rotate multiple keys to evade Gemini quotas or billing controls.**

Keys are credentials, not a quota-bypass mechanism.

---

# 14. Local Gemini Environment

Each developer creates their own local `.env`:

```env
GEMINI_API_KEY=YOUR_LOCAL_KEY
```

The `.gitignore` must include:

```gitignore
.env
.env.*
!.env.example
```

A safe repository file:

```text
.env.example
```

contains:

```env
GEMINI_API_KEY=
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_REGION=
```

No real key.

---

# 15. Google GenAI SDK

Use the current Google GenAI SDK.

### Python

```bash
python -m pip install -U google-genai
```

Google recommends the `google-genai` SDK and has documented migration away from the older `google-generativeai` package. citeturn676480search2turn676480search1

### Minimal Python client

```python
import os
from google import genai

api_key = os.environ["GEMINI_API_KEY"]

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="MODEL_ID",
    contents="Say hello."
)

print(response.text)
```

Do not hard-code:

```python
client = genai.Client(api_key="AIza...")
```

---

# 16. Backend Boundary

The frontend must **never** contain the Gemini API key in production.

Correct:

```text
Browser
   ↓
Backend API
   ↓
Gemini API
```

Incorrect:

```text
Browser
   ↓
GEMINI_API_KEY directly
   ↓
Gemini API
```

Google explicitly recommends a backend proxy/server for client applications so the key cannot simply be extracted by users. citeturn130332search0

---

# 17. Local Development Architecture

Recommended:

```text
React/Vite frontend
        ↓
FastAPI backend
        ↓
Gemini client
        ↓
GEMINI_API_KEY
```

Local commands can eventually resemble:

```bash
# backend
cd backend
python -m uvicorn app.main:app --reload

# frontend
cd frontend
npm install
npm run dev
```

The exact framework layout is defined elsewhere; this file is only defining environment and deployment contracts.

---

# 18. Data Strategy for the 3-Hour MVP

The project should **crawl SRM AP public content ahead of runtime queries**.

Do not make the user wait while the application calls the SRM AP website on every question.

Instead:

```text
Crawl
 ↓
Parse
 ↓
Clean
 ↓
Classify
 ↓
Store
 ↓
Index
 ↓
Query local/indexed knowledge
```

---

# 19. What Gets Scraped

Member A should prioritize:

```text
Institutional pages
Academic pages
Academic regulations
Policies
Programme/course information
Department pages
Student resources
Clubs/organizations
Events
Announcements/notices
Facilities
Library
Hostel
Portals
Forms
Public PDFs
```

The crawler should respect:

- robots.txt where applicable,
- site terms/policies,
- access controls,
- rate limits,
- public/private boundaries.

Do not attempt to defeat authentication or access restrictions.

---

# 20. Crawl Output Contract

Each extracted resource should ultimately resemble:

```json
{
  "id": "resource-001",
  "title": "Academic Regulations",
  "url": "https://...",
  "type": "policy",
  "category": "academics",
  "subcategory": "regulations",
  "description": "...",
  "content": "...",
  "authority": "official",
  "source_domain": "srm...",
  "last_seen": "2026-09-29"
}
```

The data person owns extraction.

The AI person owns how those objects are retrieved and interpreted.

The frontend/deployment person consumes the same schema.

---

# 21. MVP Data Storage Decision

For a three-hour build, avoid premature distributed infrastructure.

Recommended:

### Structured records

Use:

```text
SQLite
```

or the team's existing lightweight SQL database.

### Vector data

Use:

```text
FAISS
```

or a lightweight local vector store already familiar to the team.

### Deployment

For the MVP, package the generated index/database into the application image if it is static.

This means:

```text
crawl before final deployment
        ↓
build index
        ↓
include index in container image
        ↓
deploy
```

This avoids needing to build live data infrastructure during the first three hours.

---

# 22. Important Cloud Run Storage Caveat

Do not treat the container filesystem as the long-term database for mutable production data.

For this hackathon, a **read-only/static packaged dataset** is acceptable.

Later, if the team needs:

- live event updates,
- continuously refreshed crawl data,
- multiple application instances,
- durable writes,

move the data into a managed persistent service.

For the MVP:

> **Static packaged index > spending an hour building storage infrastructure.**

---

# 23. Cloud Run Deployment Model

Recommended final structure:

```text
                 Google Cloud
                     │
                  Cloud Run
                     │
          ┌──────────┴──────────┐
          │                     │
       Frontend              Backend
          │                     │
          └──────────┬──────────┘
                     │
                 Gemini API
                     │
              Secret Manager
```

A combined frontend/backend container is acceptable for the hackathon if that is materially faster.

Do not split services just because microservices sound sophisticated.

---

# 24. Cloud Run Service Name

Use:

```text
srm-ap-navigator
```

or:

```text
srm-navigator
```

The final URL will be generated by Cloud Run.

---

# 25. Choose a Region

Pick one region and keep deployment components aligned where practical.

For a hackathon, do not waste time optimizing regional economics.

Record:

```env
GOOGLE_CLOUD_REGION=YOUR_REGION
```

The exact selected region should be written into the team handoff notes.

---

# 26. Artifact Registry

If deploying a container image explicitly:

```text
Artifact Registry
      ↓
Docker image
      ↓
Cloud Run
```

Google's Artifact Registry documentation uses image references in this form:

```text
LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY/IMAGE:TAG
```

and `gcloud auth configure-docker` can configure Docker authentication for the repository host. citeturn676480search0turn676480search8

Example repository:

```text
srm-ap
```

Example image:

```text
srm-navigator
```

---

# 27. Create Artifact Registry Repository

Example:

```bash
gcloud artifacts repositories create srm-ap \
  --repository-format=docker \
  --location=YOUR_REGION \
  --description="SRM AP Navigator container images"
```

Verify:

```bash
gcloud artifacts repositories list
```

---

# 28. Authenticate Docker to Artifact Registry

Example:

```bash
gcloud auth configure-docker YOUR_REGION-docker.pkg.dev
```

Then Docker can push to the configured repository.

Official documentation: Google Artifact Registry Docker authentication and push workflow. citeturn676480search0turn676480search8

---

# 29. Container Image Naming

Example:

```bash
IMAGE="YOUR_REGION-docker.pkg.dev/YOUR_PROJECT_ID/srm-ap/srm-navigator:latest"
```

Build:

```bash
docker build -t "$IMAGE" .
```

Push:

```bash
docker push "$IMAGE"
```

Then deploy the image to Cloud Run.

---

# 30. Faster Alternative — Deploy from Source

For supported source deployments, Google Cloud can build/containerize the source and deploy it to Cloud Run, including automatic use of an Artifact Registry repository. citeturn676480search3

This may be faster for the hackathon than manually managing a Docker image.

Use it if the team's stack and repo layout make it reliable.

### Decision rule

Use:

```text
Deploy from source
```

when:

- the app is standard,
- the build works cleanly,
- you do not need a custom container workflow.

Use:

```text
Docker → Artifact Registry → Cloud Run
```

when:

- the project already has a Dockerfile,
- dependencies are nonstandard,
- local build parity matters.

---

# 31. Production Secret — Secret Manager

The Gemini production key should be stored in Google Secret Manager.

Google recommends Secret Manager for sensitive values such as API keys rather than putting them into ordinary service environment-variable configuration. citeturn130332search1turn130332search3

Create a secret:

```bash
gcloud secrets create GEMINI_API_KEY \
  --replication-policy="automatic"
```

Add the key as a secret version:

```bash
printf '%s' 'YOUR_PRODUCTION_GEMINI_KEY' | \
gcloud secrets versions add GEMINI_API_KEY \
  --data-file=-
```

Do not paste the command containing the real key into Git or project documentation.

---

# 32. Secret Access Model

Create a dedicated Cloud Run service account.

Example:

```bash
gcloud iam service-accounts create srm-navigator-run \
  --display-name="SRM Navigator Cloud Run"
```

Find its email:

```bash
gcloud iam service-accounts list
```

Typical form:

```text
srm-navigator-run@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

---

# 33. Grant Secret Access

Grant this service account permission to read the Gemini secret:

```bash
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:srm-navigator-run@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Google's IAM guidance recommends granting the Secret Manager Secret Accessor role at the lowest resource scope necessary; a service that only needs one secret should not automatically receive access to all secrets. citeturn150708search0turn150708search3

---

# 34. Deploy with Secret

Example pattern:

```bash
gcloud run deploy srm-ap-navigator \
  --image="YOUR_REGION-docker.pkg.dev/YOUR_PROJECT_ID/srm-ap/srm-navigator:latest" \
  --region="YOUR_REGION" \
  --service-account="srm-navigator-run@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --update-secrets="GEMINI_API_KEY=GEMINI_API_KEY:1" \
  --allow-unauthenticated
```

Cloud Run supports passing a Secret Manager secret to a service as an environment variable; Google recommends pinning a specific secret version for environment-variable usage rather than using `latest`. citeturn130332search2turn130332search3

---

# 35. Why Pin Version 1

For the MVP:

```text
GEMINI_API_KEY:1
```

is easier to reason about than:

```text
GEMINI_API_KEY:latest
```

When rotating the production key:

```text
version 1
   ↓
version 2
   ↓
redeploy / update
```

After verifying version 2, old credentials can be disabled/removed according to the team's cleanup policy.

Google's Cloud Run documentation specifically recommends pinning a version when a secret is exposed through an environment variable. citeturn130332search2

---

# 36. Cloud Run Public Access

The demo application generally needs public access.

Example:

```bash
gcloud run services add-iam-policy-binding srm-ap-navigator \
  --region="YOUR_REGION" \
  --member="allUsers" \
  --role="roles/run.invoker"
```

Or configure public access during deployment:

```bash
--allow-unauthenticated
```

Google's Cloud Run quickstart documents public access configuration and the resulting service URL. citeturn560938search1

---

# 37. Production Environment Contract

The backend should expect:

```env
GEMINI_API_KEY=<injected by Secret Manager>

GOOGLE_CLOUD_PROJECT=...
GOOGLE_CLOUD_REGION=...

APP_ENV=production
```

The frontend should not receive:

```text
GEMINI_API_KEY
```

The browser should only know the public backend/API endpoint.

---

# 38. Backend Configuration Pattern

Python example:

```python
import os

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "")
REGION = os.getenv("GOOGLE_CLOUD_REGION", "")
```

Fail fast if required configuration is missing:

```python
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured")
```

Do not silently fall back to an embedded key.

---

# 39. Health Endpoint

The backend should provide something like:

```text
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

Optionally:

```json
{
  "status": "ok",
  "gemini_configured": true,
  "index_loaded": true
}
```

Never return the secret itself.

---

# 40. Readiness Endpoint

If practical:

```text
GET /ready
```

checks:

```text
application booted
+
index loaded
+
required configuration exists
```

This helps Member C diagnose deployment problems quickly.

---

# 41. Local vs Production Matrix

| Concern | Local | Production |
|---|---|---|
| Gemini credential | Developer `.env` | Secret Manager |
| Database/index | Local files | Packaged static index for MVP |
| Frontend | Vite dev server | Cloud Run |
| Backend | Local FastAPI | Cloud Run |
| Logs | Terminal | Cloud logging/runtime logs |
| Secrets | `.env` ignored by Git | Secret Manager |
| URL | localhost | Cloud Run URL |
| Data refresh | Manual | Manual for MVP |

---

# 42. Team Handoff — Member C → Everyone

Member C must publish a non-secret handoff:

```text
PROJECT:
SRM AP Information Navigator

GOOGLE CLOUD PROJECT:
<project id>

PROJECT NUMBER:
<project number>

REGION:
<region>

CLOUD RUN SERVICE:
<srv name>

DEPLOYMENT URL:
<url>

ARTIFACT REPOSITORY:
<repo>

SECRET NAME:
GEMINI_API_KEY

LOCAL SETUP:
Use your own local Gemini key in .env.

PRODUCTION:
Cloud Run receives the production key from Secret Manager.
```

Never include:

```text
GEMINI_API_KEY=<actual value>
```

---

# 43. Team Handoff — Member A → Member B

Member A provides:

```text
data/resources.json
```

or equivalent database/index artifact containing:

- normalized resource objects,
- source URLs,
- categories,
- source type,
- authority,
- timestamps,
- extracted content.

Member B should not have to reverse-engineer the scraper.

---

# 44. Team Handoff — Member B → Member C

Member B provides:

```text
API contract
startup command
health endpoint
required environment variables
```

Example:

```text
POST /api/chat
GET /health
```

Request:

```json
{
  "message": "Where is the attendance policy?"
}
```

Response:

```json
{
  "answer": "You're looking for...",
  "intent": "POLICY_LOOKUP",
  "path": [
    "Academics",
    "Regulations",
    "Attendance"
  ],
  "resources": [],
  "actions": [],
  "related": []
}
```

Member C deploys the same contract, not a rewritten approximation.

---

# 45. Cloud Deployment Checklist

## Project

- [ ] Google account authenticated
- [ ] dedicated project selected
- [ ] project ID recorded
- [ ] project number recorded
- [ ] region selected

## Services

- [ ] Cloud Run available
- [ ] Artifact Registry available if using images
- [ ] Secret Manager enabled
- [ ] Cloud Build available if used

## Gemini

- [ ] current supported API key created
- [ ] key associated with intended project
- [ ] local test succeeds
- [ ] key not committed to Git

## Secrets

- [ ] production key stored in Secret Manager
- [ ] Cloud Run service account created
- [ ] Secret Accessor granted only where required
- [ ] secret version recorded

## Deployment

- [ ] image/source builds
- [ ] service deploys
- [ ] production environment receives secret
- [ ] health endpoint works
- [ ] public URL opens
- [ ] chat query works

---

# 46. Gemini Smoke Test

Before the team spends time debugging the application, test Gemini separately.

Create:

```text
scripts/test_gemini.py
```

Example:

```python
import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

response = client.models.generate_content(
    model="MODEL_ID",
    contents="Return exactly: GEMINI_OK"
)

print(response.text)
```

Run:

```bash
python scripts/test_gemini.py
```

Expected:

```text
GEMINI_OK
```

If this fails, fix credentials/API configuration before blaming the application.

---

# 47. Deployment Smoke Test

After deployment:

```text
1. Open URL
2. Load home page
3. Submit demo query
4. Verify backend response
5. Verify Gemini response
6. Verify path
7. Click source
8. Verify official URL opens
```

Then test:

```text
browser refresh
```

The deployed application should remain functional after reload.

---

# 48. Key Security Checklist

### Never

- commit API keys,
- paste keys into GitHub issues,
- include keys in screenshots,
- hard-code keys in React,
- put production keys in frontend bundles,
- upload `.env` files,
- put keys into pitch slides,
- send production keys through group chats.

### Always

- use environment variables locally,
- use Secret Manager for production,
- use a backend for Gemini calls,
- rotate leaked credentials,
- use minimum IAM permissions.

Google explicitly recommends treating API keys as passwords and using Secret Manager for production secrets. citeturn130332search0turn150708search0

---

# 49. If a Key Leaks

Treat it as compromised immediately.

Process:

```text
Leak detected
    ↓
Create replacement key
    ↓
Update Secret Manager
    ↓
Deploy new revision
    ↓
Verify application
    ↓
Disable/delete compromised credential
    ↓
Review usage/billing
```

Google's current guidance includes replacing the key, updating the application, disabling/deleting the compromised key after verification, and auditing usage. citeturn130332search0

Do not assume a leaked key is harmless because the hackathon is short.

---

# 50. Billing / Cost Guardrail

Gemini and Google Cloud usage can incur cost depending on the service/tier/configuration.

The team should establish:

```text
maximum acceptable spend
+
billing alerts
+
who owns the Google Cloud project
```

Google recommends billing alerts to detect unexpected usage/cost increases. citeturn130332search0

For a three-hour hackathon, do not leave an uncontrolled resource running after the event if it is not needed.

---

# 51. Post-Hackathon Shutdown

After judging/demo:

```text
If project is no longer needed:
    ↓
remove or disable exposed demo services
    ↓
review secrets
    ↓
review billing
    ↓
delete unused resources
```

Cloud Run and other resources can continue existing after the demo.

Do not assume that "we stopped using it" means "nothing can cost money."

---

# 52. Common Failure Modes

## Failure 1 — Gemini key works locally but deployment says missing key

Likely issue:

```text
Cloud Run secret not injected
```

Check:

- secret name,
- secret version,
- service account,
- IAM Secret Accessor role,
- deployment revision.

---

## Failure 2 — Cloud Run deploys but Gemini returns authentication error

Check:

```text
GEMINI_API_KEY
```

inside the runtime configuration.

Do not print the key.

Log:

```text
gemini_configured = bool(os.getenv("GEMINI_API_KEY"))
```

not the credential.

---

## Failure 3 — Frontend works but API fails

Check:

```text
frontend API base URL
CORS
Cloud Run URL
backend route
```

---

## Failure 4 — Index disappears after deployment

The team probably treated the container filesystem as mutable persistent storage.

For the MVP, solve it by:

```text
build index before deploy
+
package index into image
```

For a later production version, move the persistent data layer to managed storage.

---

## Failure 5 — Scraped content exists but retrieval is terrible

Likely:

- bad chunking,
- duplicate pages,
- menu/footer noise,
- missing metadata,
- weak classification,
- too many irrelevant chunks.

Fix the data pipeline before making the prompt larger.

---

# 53. 3-Hour Cloud Schedule

## 0:00–0:10

Member C:

- authenticate gcloud,
- create/select project,
- select region.

Member A:

- begin crawler targets.

Member B:

- install Gemini SDK,
- create local smoke test.

---

## 0:10–0:25

Member C:

- enable required services,
- create deployment skeleton,
- create service account.

Member A:

- first pages extracted.

Member B:

- first Gemini response.

---

## 0:25–0:45

Member C:

- Secret Manager secret,
- local deployment path.

Member A:

- normalized resources.

Member B:

- routing + response schema.

---

## 0:45–1:15

Member C:

- Cloud Run skeleton deployed.

Member A:

- meaningful corpus.

Member B:

- RAG connected.

---

## 1:15–1:45

All:

- vertical integration.

Member C:
- deploy working revision.

Member A:
- improve data quality.

Member B:
- fix retrieval/response grounding.

---

## 1:45–2:15

Add:

- SQL path,
- event discovery,
- more resource coverage,
- final UI integration.

---

## 2:15–2:30

Production verification:

```text
URL
↓
query
↓
Gemini
↓
retrieval
↓
path
↓
source
```

---

## 2:30–3:00

No new architecture.

Only:

- bug fixes,
- deployment,
- demo stability,
- polish,
- rehearsal.

---

# 54. Cloud Owner "Done" Checklist

Member C can declare cloud complete only when:

```text
[ ] Google Cloud project exists
[ ] project ID recorded
[ ] region recorded
[ ] Gemini key works locally
[ ] production secret exists
[ ] service account exists
[ ] service account can access secret
[ ] application builds
[ ] Cloud Run service deploys
[ ] public URL works
[ ] /health works
[ ] /api/chat works
[ ] Gemini works through production
[ ] source links open
[ ] no secret is present in repository
```

---

# 55. Data Owner "Done" Checklist

Member A can declare data ready when:

```text
[ ] target source domains identified
[ ] crawler runs
[ ] HTML extraction works
[ ] PDF extraction works where needed
[ ] boilerplate removed
[ ] URLs preserved
[ ] titles preserved
[ ] categories assigned
[ ] authority field assigned
[ ] last_seen recorded
[ ] duplicates reduced
[ ] representative corpus available
[ ] index artifact generated
```

---

# 56. AI Owner "Done" Checklist

Member B can declare AI ready when:

```text
[ ] Gemini client works
[ ] query intent is classified
[ ] SQL route works
[ ] RAG route works
[ ] navigation path is generated
[ ] source metadata retained
[ ] unsupported claims are rejected
[ ] response JSON validates
[ ] frontend can render it
[ ] production endpoint works
```

---

# 57. Final Shared Architecture

```text
                  PUBLIC SRM AP WEB
                         │
                         ▼
                ┌─────────────────┐
                │ Member A        │
                │ Crawl + Clean   │
                │ Classify + Index│
                └────────┬────────┘
                         │
              ┌──────────┴───────────┐
              ▼                      ▼
         Structured DB          Vector Index
              │                      │
              └──────────┬───────────┘
                         ▼
                ┌─────────────────┐
                │ Member B        │
                │ AI Router       │
                │ Gemini + RAG    │
                │ Text-to-SQL     │
                └────────┬────────┘
                         │
                         ▼
                Structured Response
                         │
                         ▼
                ┌─────────────────┐
                │ Member C        │
                │ Cloud + Deploy  │
                │ UI + Demo       │
                └────────┬────────┘
                         │
                         ▼
                     CLOUD RUN
                         │
                         ▼
                     STUDENT
```

---

# 58. The Critical Rule

Do not let Google Cloud setup become the team's bottleneck.

The team should be able to develop locally without waiting for:

- Artifact Registry,
- Cloud Run,
- Secret Manager,
- production deployment.

Likewise, Member C should be able to deploy even while Member A is still improving the scraper.

Therefore:

```text
LOCAL CONTRACT
+
PRODUCTION CONTRACT
```

must stay compatible.

---

# 59. Final Onboarding Sequence

Follow exactly this order before serious implementation:

```text
1. Read 00_START_HERE.md
2. Read 01_PROJECT_PLAN.md
3. Choose Google Cloud project
4. Set project ID / region
5. Authenticate gcloud
6. Create current Gemini API key
7. Test Gemini locally
8. Install google-genai
9. Create .env.example
10. Start crawler
11. Create first resource dataset
12. Implement AI routing
13. Create backend endpoint
14. Create frontend integration
15. Create Secret Manager secret
16. Create Cloud Run service account
17. Grant secret accessor
18. Deploy
19. Run end-to-end smoke test
20. Freeze deployment before final demo
```

---

# 60. Final Operational Principle

The team's cloud setup is successful when it becomes invisible.

A developer should think:

```text
I have data.
I have an AI endpoint.
I have a deployed app.
```

not:

```text
I am fighting IAM for 90 minutes.
```

And the final product remains:

> **Question → Direction → Official Source → Action.**

Google Cloud, Gemini, crawling, SQL, RAG and deployment are supporting infrastructure for that single user outcome.