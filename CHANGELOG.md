# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] — 2026-07-17

### Added

- **Importable library API.** The package now exposes a public entry point (`src/index.ts` → `dist/index.js`, with type declarations) so other apps can create, update, and read Google Forms quizzes in-process — e.g. `import { createGoogleFormFromQuiz } from "google-forms-quiz-tool"`. The CLI is unchanged and still installs as `quiz-tool`.
- `emailCollection` top-level YAML field to control how the published form collects respondent email addresses: `verified` (default), `responder_input`, or `none`.
- `--folder-id` option on the `create` command to place new forms in a specific Google Drive folder.
- Local deployment log — every successful `create` appends to `.deployments/deployments.json` so you have a running record of forms you've created.
- A full vitest test suite covering YAML I/O, validation, the Google Forms mapping layer, OAuth helpers, deployment tracking, and the CLI. Coverage report written to `coverage/`.

### Changed

- **Auth is now injected, not acquired internally.** `createGoogleFormFromQuiz`, `updateGoogleFormFromQuiz`, and `downloadFormAsQuizFile` take an authorized `OAuth2Client` via an options argument (`{ auth }`). The CLI still obtains the client through the interactive local-auth flow and passes it in; library consumers supply their own (e.g. built from a stored refresh token). One auth-agnostic core now serves both the CLI and an in-process host.
- Documentation rewritten throughout for clarity and to lower the barrier for users new to the Google Cloud Console and OAuth. Major rewrites: `README.md`, `GOOGLE_SETUP.md`, `QUICKSTART.md`, `YAML_FORMAT.md`.
- Upgraded `googleapis` to v173 (for `emailCollectionType` support) and aligned `google-auth-library` to v10 via a dependency override.

### Fixed

- `update` (and `create`) no longer fail with a fatal error when run against a form the tool didn't create. The cosmetic Google Drive rename/move requires the `drive.file` scope and returns HTTP 403 for externally-created forms; this is now caught and reported as a warning, since the form's questions, title, description, and quiz settings are already applied successfully.

## [1.0.0] — 2026-05-21

### Added

- Initial release.
- **CLI commands**:
  - `init-template` — generate a starter YAML quiz template.
  - `create` — create a new Google Form from YAML.
  - `download` — download an existing Google Form as YAML.
  - `update` — replace the questions in an existing form from YAML.
- **Question types**: single choice (radio), multiple choice (checkboxes), dropdown, short text, long text.
- **Features**: correct-answer marking, point-based scoring, required vs. optional fields, per-question descriptions, quiz-vs-survey mode, strict YAML validation.
- **Authentication**: OAuth 2.0 with local browser flow, token caching, configurable credentials and token paths via `.env`.
- **Build & dev tooling**: TypeScript source, ESM modules, `tsx`-based dev mode, npm scripts for build/dev/lint.
- **Documentation**: README, QUICKSTART, GOOGLE_SETUP, YAML_FORMAT, EXAMPLES, ADVANCED, INDEX.

### Known limitations (intentional scope)

- No form styling (colours, fonts, header images).
- No page sections or conditional branching.
- No rich media (images, videos) — skipped on download.
- No response analytics.
- Text auto-grading is exact-match only (Google Forms limitation).

### Security

- OAuth client credentials and tokens stored locally and excluded from version control via `.gitignore`.
- Local browser auth flow only; no third-party server is involved.
- The tool requests only the `forms.body` and `drive.file` scopes — it cannot read your wider Drive, Gmail, or Calendar.

---

## Planned

### Near term

- [ ] `--dry-run` flag to preview changes without uploading.
- [ ] JSON and CSV import for questions.
- [ ] Optional non-destructive `update` mode (append/replace specific questions).
- [ ] Question reordering helpers.

### Mid term

- [ ] Web UI for quiz editing.
- [ ] Visual diff during `download` so changes from Google Forms surface clearly.
- [ ] Webhook integration for automated uploads on file change.

### Long term

- [ ] Support for form sections.
- [ ] Basic image upload to question prompts.
- [ ] Response summary retrieval.
- [ ] Custom scoring rules (e.g. partial credit, numeric tolerance).

## Support and contributing

- For setup help: [GOOGLE_SETUP.md](GOOGLE_SETUP.md).
- For usage patterns: [EXAMPLES.md](EXAMPLES.md).
- For YAML field reference: [YAML_FORMAT.md](YAML_FORMAT.md).
- For scripting / CI: [ADVANCED.md](ADVANCED.md).

Source layout for contributors:

```text
src/
├── cli.ts              ← CLI command handlers (yargs)
└── lib/
    ├── types.ts        ← TypeScript interfaces
    ├── validation.ts   ← YAML validation
    ├── quiz-file.ts    ← YAML file I/O
    ├── google-forms.ts ← Google Forms API wrapper
    ├── google-auth.ts  ← OAuth authentication
    └── deployments.ts  ← Local deployment log
tests/
└── *.test.ts           ← vitest suite mirroring src/
```

Workflow:

1. Make your changes in `src/` (and update tests in `tests/`).
2. `npm run lint` — fix any style errors.
3. `npm test` — make sure the suite passes.
4. `npm run build` — verify it still compiles.

### Release process

1. Bump the version in `package.json`.
2. Move the `[Unreleased]` section in this file under a new version heading with today's date.
3. `git tag v<version>` and `git push --tags`.
4. (Optional) `npm publish`.

### Backwards compatibility

The YAML header includes `version: 1`. Version 1 will remain supported indefinitely; future format changes will introduce `version: 2` and the tool will accept both.
