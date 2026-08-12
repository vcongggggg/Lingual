# Lingual — Git & Engineering Workflow Guidelines

## 1. Git Branching Strategy
- **`main`**: Production-ready, stable codebase.
- **`develop`**: Development integration branch.
- **Feature Branches**: `feature/<feature-name>` (e.g., `feature/ielts-speaking-evaluator`).
- **Fix Branches**: `fix/<bug-name>` (e.g., `fix/srs-hydration-mismatch`).
- **Chore Branches**: `chore/<task-name>` (e.g., `chore/update-dependencies`).

## 2. Commit Message Standards (Conventional Commits)
All commit messages must follow the standard format:
`<type>(<scope>): <description>`

### Types:
- `feat`: A new feature implemented.
- `fix`: A bug fix or error resolution.
- `docs`: Documentation update only.
- `style`: Formatting, whitespace, visual tweak (no functional logic change).
- `refactor`: Restructuring code without changing functionality.
- `perf`: Performance optimization.
- `test`: Unit / E2E test addition or updates.
- `chore`: Build config, dependencies, maintenance tasks.

### Examples:
- `feat(web): add interactive 3d hero section with parallax tilt`
- `fix(srs): resolve hydration mismatch in flashcard orbit`
- `chore(monorepo): clean up unused markdown plan specifications`

## 3. Mandatory Workflow Steps
1. **Branch**: Create or checkout appropriate feature/fix branch before making major changes.
2. **Atomic Commits**: Stage and commit logical units of work separately.
3. **Pre-commit Verification**: Run type check (`tsc`) or build (`pnpm build`) before pushing.
4. **Clean Merge & Push**: Ensure working directory is clean and pushed up to remote repository.
