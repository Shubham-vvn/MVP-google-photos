# Contributing Guidelines & Engineering Standards
## Google Photos — AI Memory Context MVP
**Document Reference:** `CONTRIBUTING.md`

---

### 1. Branching Strategy & Git Workflow

We adhere to **Trunk-Based Development** with short-lived feature branches to ensure rapid integration and continuous delivery.

```
main (Production) ----------------------------------------------------->
        ^                               ^
        | PR (Squash & Merge)           | PR (Squash & Merge)
develop (Staging) ---------------------------------------------------->
        ^                               ^
        |                               |
feature/mem-101-spanner-dal      feature/mem-102-gemini-nlu
```

#### Branch Naming Conventions
- `feature/<ticket-id>-<short-description>` (e.g., `feature/p1-spanner-dal`)
- `fix/<ticket-id>-<bug-summary>` (e.g., `fix/search-rrf-weight-null`)
- `chore/<task>` (e.g., `chore/update-deps`)
- `experiment/<idea>` (e.g., `experiment/scann-tuning`)

#### Pull Request Rules
1. **Branch Protection:** No direct pushes to `main` or `develop`.
2. **Review Requirement:** Minimum of **1 peer approval** from a code owner.
3. **CI Status Checks:** All GitHub Actions checks (`validate-specs`, `code-quality-and-tests`, `terraform-lint`) must be green.
4. **Squash and Merge:** Branches are squashed into a single clean commit on merge.

---

### 2. Commit Message Guidelines (Conventional Commits)

Format: `<type>(<scope>): <subject>`

#### Types
- `feat`: A new feature for the user or API.
- `fix`: A bug fix.
- `docs`: Documentation changes only.
- `style`: Formatting, missing semicolons, etc. (no code change).
- `refactor`: Refactoring production code without behavior change.
- `test`: Adding or updating tests.
- `chore`: Updating build scripts, package dependencies, Terraform configs.

#### Examples
```text
feat(nlu): integrate Gemini 1.5 Flash structured entity extraction
fix(search): prevent duplicate photo IDs in RRF ranking output
test(dal): add unit tests for Spanner MemoryContext transaction rollback
docs(api): update OpenAPI spec with cluster dismissal enum
```

---

### 3. Code Review Checklist

Reviewers must verify the following before approving:
- [ ] **Data Privacy:** No raw PII or user audio is written to persistent logs.
- [ ] **Error Handling:** All external AI API calls (Gemini, Vision, STT) have timeout and fallback handling.
- [ ] **Type Safety:** No use of `any` in TypeScript; Zod schemas validate all API inputs.
- [ ] **Security:** No hardcoded secrets; credentials read from environment or Secret Manager.
- [ ] **Performance:** Database queries leverage primary keys or defined secondary indexes.
- [ ] **Test Coverage:** New business logic covered by unit or integration tests (minimum 85% coverage).

---

### 4. Development Environment Setup

```bash
# 1. Clone repository
git clone https://github.com/google/photos-ai-memory-context.git
cd photos-ai-memory-context

# 2. Install dependencies
npm install

# 3. Configure local environment
cp configs/dev.env.example .env

# 4. Start local development server
npm run dev

# 5. Run test suite
npm test
```
