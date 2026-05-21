# Project File Guide

Navigate the quiz-generator project with this file reference.

## 📚 Documentation Files

Start with any of these based on your needs:

| File                                         | Size      | Purpose                                  | Read If...                    |
| -------------------------------------------- | --------- | ---------------------------------------- | ----------------------------- |
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | 3 KB      | **START HERE** - Essential setup & usage | You're new to the tool        |
| **[QUICKSTART.md](QUICKSTART.md)**           | 3.5 KB    | 5-minute setup guide                     | You want fast setup           |
| [README.md](README.md)                       | 5 KB      | Project overview & command reference     | You want the main docs        |
| [GOOGLE_SETUP.md](GOOGLE_SETUP.md)           | 5 KB      | Google Cloud OAuth setup guide           | Setting up Google credentials |
| [YAML_FORMAT.md](YAML_FORMAT.md)             | 9 KB      | Complete YAML specification              | You need format details       |
| [EXAMPLES.md](EXAMPLES.md)                   | 10 KB     | Real-world quiz examples                 | You want sample quizzes       |
| [ADVANCED.md](ADVANCED.md)                   | 8 KB      | Scripting, CI/CD, advanced patterns      | You're an advanced user       |
| [INDEX.md](INDEX.md)                         | 7 KB      | Documentation navigation guide           | You need to find something    |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)     | 9 KB      | Complete project overview                | You want the full picture     |
| [CHANGELOG.md](CHANGELOG.md)                 | 5 KB      | Version history & roadmap                | You want release notes        |
| **[FILE_GUIDE.md](FILE_GUIDE.md)**           | This file | Project file reference                   | You want a file map           |

**Total documentation:** 2,300+ lines covering every aspect of the tool.

---

## 💻 Source Code Files

The application is written in TypeScript. All source files are in `src/`:

| File                                               | Lines | Purpose                           |
| -------------------------------------------------- | ----- | --------------------------------- |
| [src/cli.ts](src/cli.ts)                           | ~120  | Command-line interface with Yargs |
| [src/lib/types.ts](src/lib/types.ts)               | ~35   | TypeScript interfaces & types     |
| [src/lib/validation.ts](src/lib/validation.ts)     | ~100  | YAML validation logic             |
| [src/lib/quiz-file.ts](src/lib/quiz-file.ts)       | ~45   | YAML file read/write operations   |
| [src/lib/google-forms.ts](src/lib/google-forms.ts) | ~200  | Google Forms API integration      |
| [src/lib/google-auth.ts](src/lib/google-auth.ts)   | ~95   | OAuth 2.0 authentication          |

**Total source code:** ~595 lines of TypeScript

### Source File Descriptions

#### [src/cli.ts](src/cli.ts)

The main CLI entry point using Yargs framework.

- Defines 4 commands: `init-template`, `create`, `download`, `update`
- Handles command-line arguments and options
- Calls library functions to perform actions

#### [src/lib/types.ts](src/lib/types.ts)

TypeScript interfaces defining the quiz data model.

- `QuizForm` - Main form structure
- `QuizQuestion` - Individual question
- `QuizOption` - Answer option
- `QuizQuestionType` - Question type union

#### [src/lib/validation.ts](src/lib/validation.ts)

Validates YAML quiz files before uploading.

- Checks version, title, questions
- Validates question types and required fields
- Validates choice questions have 2+ options
- Validates text vs choice question fields
- Provides detailed error messages

#### [src/lib/quiz-file.ts](src/lib/quiz-file.ts)

Handles YAML file I/O operations.

- `readQuizFile()` - Parse YAML to JavaScript object
- `writeQuizFile()` - Write JavaScript object as YAML
- `buildTemplateQuizFile()` - Generate template quiz
- Uses `js-yaml` library for YAML handling

#### [src/lib/google-forms.ts](src/lib/google-forms.ts)

Google Forms API integration layer.

- Converts quiz YAML ↔ Google Forms API format
- `downloadFormAsQuizFile()` - Download form to YAML
- `createGoogleFormFromQuiz()` - Create new form
- `updateGoogleFormFromQuiz()` - Update existing form
- Maps question types (single_choice → RADIO, etc.)
- Handles answer keys and grading

#### [src/lib/google-auth.ts](src/lib/google-auth.ts)

OAuth 2.0 authentication with Google.

- `getAuthorizedClient()` - Get authenticated OAuth client
- Handles local browser-based OAuth flow
- Saves tokens to local file
- Loads saved tokens for subsequent runs
- Respects `GOOGLE_CREDENTIALS_PATH` and `GOOGLE_TOKEN_PATH` env vars

---

## ⚙️ Configuration Files

| File                           | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| [package.json](package.json)   | Dependencies, scripts, project metadata              |
| [tsconfig.json](tsconfig.json) | TypeScript compiler configuration                    |
| [.gitignore](.gitignore)       | Git ignore rules (credentials, tokens, node_modules) |
| [.env.example](.env.example)   | Environment variable template                        |

### [package.json](package.json)

Defines:

- **name**: `google-forms-quiz-tool`
- **version**: `1.0.0`
- **scripts**:
  - `npm run build` - Compile TypeScript
  - `npm run dev` - Run with tsx (development)
  - `npm run start` - Run compiled JavaScript
  - `npm run lint` - Run ESLint
- **dependencies**: Google APIs, OAuth, Yargs, YAML parser
- **devDependencies**: TypeScript, type definitions, ESLint

### [tsconfig.json](tsconfig.json)

TypeScript compiler options:

- Targets ES2020
- Module: ESNext
- Strict mode enabled
- CommonJS interop
- Resolves Node.js modules

### [.env.example](.env.example)

Template for environment variables:

- `GOOGLE_CREDENTIALS_PATH` - Path to credentials.json
- `GOOGLE_TOKEN_PATH` - Path to OAuth token file

### [.gitignore](.gitignore)

Prevents accidentally committing:

- `node_modules/` - Dependencies
- `dist/` - Compiled output
- `.env` - Environment secrets
- `credentials.json` - Google OAuth credentials
- `tokens/` - Saved OAuth tokens
- `*.log` - Log files

---

## 📦 Generated Files

These are created automatically by the build process:

### [dist/](dist/)

Compiled JavaScript output:

- `dist/cli.js` - Compiled CLI
- `dist/lib/` - Compiled library files

Generated by: `npm run build`

### [node_modules/](node_modules/)

Third-party dependencies installed by npm.

Generated by: `npm install`

Excluded from git via `.gitignore`

---

## 📋 Example Files

### [examples/sample-quiz.yaml](examples/sample-quiz.yaml)

Working example quiz demonstrating all question types:

- Single choice question
- Multiple choice question
- Dropdown question
- Short text question
- Long text question

Can be used as reference or starting point.

---

## 🔧 Development & Build

### Build Process

```bash
npm run build
```

Runs: `tsc -p tsconfig.json`

- Compiles `src/**/*.ts` to `dist/**/*.js`
- Generates `.d.ts` type declaration files
- Respects `tsconfig.json` settings

### Development Mode

```bash
npm run dev -- <command>
```

Runs: `tsx src/cli.ts <command>`

- Uses `tsx` to run TypeScript directly
- No build step needed
- Fast for development iteration

### Production Mode

```bash
npm run start -- <command>
```

Runs: `node dist/cli.js <command>`

- Uses pre-compiled JavaScript
- Faster than dev mode
- No TypeScript compilation needed

### Linting

```bash
npm run lint
```

Runs: `eslint .`

- Checks code style
- Finds potential errors
- Configured in ESLint config

---

## 📁 Directory Structure

```
quiz-generator/
│
├── 📄 Documentation Files
├── README.md                   Main overview
├── GETTING_STARTED.md          ← START HERE
├── QUICKSTART.md               5-minute setup
├── GOOGLE_SETUP.md             OAuth setup
├── YAML_FORMAT.md              Format spec
├── EXAMPLES.md                 Sample quizzes
├── ADVANCED.md                 Advanced usage
├── INDEX.md                    Documentation index
├── PROJECT_SUMMARY.md          Project overview
├── CHANGELOG.md                Version history
├── FILE_GUIDE.md              This file
│
├── 💻 Source Code
├── src/
│   ├── cli.ts                 CLI commands
│   └── lib/
│       ├── types.ts           Data types
│       ├── validation.ts      Input validation
│       ├── quiz-file.ts       YAML I/O
│       ├── google-forms.ts    Google Forms API
│       └── google-auth.ts     OAuth authentication
│
├── 📦 Generated (Build Output)
├── dist/                       Compiled JavaScript
│   ├── cli.js
│   └── lib/
│       ├── types.js
│       ├── validation.js
│       ├── quiz-file.js
│       ├── google-forms.js
│       └── google-auth.js
│
├── 📚 Examples
├── examples/
│   └── sample-quiz.yaml       Sample quiz
│
├── ⚙️ Configuration
├── package.json               Dependencies & scripts
├── package-lock.json          Locked dependency versions
├── tsconfig.json              TypeScript config
├── .env.example               Environment template
└── .gitignore                 Git ignore rules
```

---

## 🚀 Usage Paths

### For First-Time Users

1. Read: [GETTING_STARTED.md](GETTING_STARTED.md)
2. Setup: [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
3. Learn: [QUICKSTART.md](QUICKSTART.md)
4. Try: `npm run dev -- init-template -o test.yaml`

### For Quiz Creation

1. Reference: [YAML_FORMAT.md](YAML_FORMAT.md)
2. Examples: [EXAMPLES.md](EXAMPLES.md)
3. Create: Edit `.yaml` file
4. Upload: `npm run dev -- create --input file.yaml`

### For Power Users

1. Advanced: [ADVANCED.md](ADVANCED.md)
2. Scripts: See scripting patterns
3. CI/CD: See integration examples
4. Extend: Modify source files

### For Troubleshooting

1. Common issues: [README.md](README.md#troubleshooting)
2. Setup help: [GOOGLE_SETUP.md](GOOGLE_SETUP.md#troubleshooting)
3. Format errors: [YAML_FORMAT.md](YAML_FORMAT.md#validation-rules)
4. Advanced help: [ADVANCED.md](ADVANCED.md#error-handling-and-debugging)

---

## 📊 Project Stats

| Metric              | Count        |
| ------------------- | ------------ |
| TypeScript Files    | 6            |
| Documentation Files | 10           |
| Total Lines of Code | ~600         |
| Total Lines of Docs | 2,300+       |
| Example Files       | 1            |
| Commands Supported  | 4            |
| Question Types      | 5            |
| Supported APIs      | Google Forms |

---

## 🔑 Key Files Summary

| What You Want           | Read This                                          |
| ----------------------- | -------------------------------------------------- |
| Get started immediately | [GETTING_STARTED.md](GETTING_STARTED.md)           |
| 5-minute setup          | [QUICKSTART.md](QUICKSTART.md)                     |
| Project overview        | [README.md](README.md)                             |
| Complete YAML spec      | [YAML_FORMAT.md](YAML_FORMAT.md)                   |
| Real examples           | [EXAMPLES.md](EXAMPLES.md)                         |
| Google setup help       | [GOOGLE_SETUP.md](GOOGLE_SETUP.md)                 |
| Advanced usage          | [ADVANCED.md](ADVANCED.md)                         |
| Find something          | [INDEX.md](INDEX.md)                               |
| Full project details    | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)           |
| CLI source              | [src/cli.ts](src/cli.ts)                           |
| Google API code         | [src/lib/google-forms.ts](src/lib/google-forms.ts) |
| YAML validation         | [src/lib/validation.ts](src/lib/validation.ts)     |

---

## ✅ Verification Checklist

All project files are present and accounted for:

- [x] Source code in `src/`
- [x] Configuration files (package.json, tsconfig.json, .env.example)
- [x] Documentation (10 markdown files)
- [x] Examples (sample-quiz.yaml)
- [x] Build output (dist/ - auto-generated)
- [x] Dependencies (node_modules/ - auto-generated)

You're ready to use the tool!
