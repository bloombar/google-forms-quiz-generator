# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-21

### Added

- Initial release of Google Forms Quiz Tool
- **CLI Commands**:
  - `init-template` - Generate starter YAML quiz template
  - `create` - Create new Google Forms from YAML
  - `download` - Download existing Google Forms as YAML
  - `update` - Update existing Google Forms from YAML
- **Question Types**:
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - Dropdown (select list)
  - Short text (single line)
  - Long text (multi-line paragraph)
- **Features**:
  - Answer keys with correct answer marking
  - Point-based scoring system
  - Optional/required question fields
  - Question descriptions
  - Quiz vs. survey mode
  - YAML format for version control
  - Strict input validation
- **Authentication**:
  - OAuth 2.0 with local browser flow
  - Token caching for seamless subsequent use
  - Support for custom credential paths via environment
- **Build & Development**:
  - TypeScript source
  - Production build artifacts
  - ESM (ES Modules) support
  - npm scripts for build, dev, and lint
- **Documentation** (1500+ lines):
  - README with overview and command reference
  - QUICKSTART for 5-minute setup
  - GOOGLE_SETUP with step-by-step Google Cloud configuration
  - YAML_FORMAT with complete specification
  - EXAMPLES with real-world quiz samples
  - ADVANCED with scripting and CI/CD patterns
  - INDEX for documentation navigation
  - PROJECT_SUMMARY with detailed feature overview

### Design Decisions

- **YAML over JSON/CSV**: Human-readable, version control friendly
- **Command-line focus**: Simple, scriptable workflow
- **Google Forms API only**: No custom backend or database
- **Local OAuth**: No server component needed
- **Strict validation**: Catch errors before uploading
- **Question content only**: Focuses on quiz logic, not styling

### Known Limitations

- Form styling (colors, fonts) not supported
- Form sections/grouping not supported
- Rich media (images, videos) not managed (skipped on download)
- Response viewing/analytics not included
- Conditional logic/branching not supported
- Time limits and progress bars not available

### Security

- OAuth credentials stored locally in `tokens/`
- Credentials file excluded from git via `.gitignore`
- No credentials sent to external services
- Local authentication flow (no server component)

### Quality

- 100% TypeScript with strict type checking
- Comprehensive input validation
- Meaningful error messages
- Clean, modular code architecture
- Full test with included sample quiz

---

## Planned Future Enhancements

### Version 1.1

- [ ] Dry-run mode (`--dry-run` flag)
- [ ] JSON import/export support
- [ ] CSV import for questions
- [ ] Question reordering capabilities
- [ ] Batch operations on multiple forms
- [ ] Form validation report

### Version 1.2

- [ ] Web UI for quiz editing
- [ ] Visual diff when downloading changes
- [ ] Form cloning with answer key copies
- [ ] Webhook integration for automated uploads
- [ ] Form templates and presets

### Version 2.0

- [ ] Support for form sections
- [ ] Basic form image upload
- [ ] Response summary retrieval
- [ ] Custom scoring rules
- [ ] Form analytics

## Support

For issues, questions, or feature requests:

1. Check [GOOGLE_SETUP.md](GOOGLE_SETUP.md) for setup help
2. Review [EXAMPLES.md](EXAMPLES.md) for usage patterns
3. See [ADVANCED.md](ADVANCED.md) for troubleshooting
4. Consult [YAML_FORMAT.md](YAML_FORMAT.md) for format validation

## Contributing

The codebase is organized as follows:

```
src/
├── cli.ts              - CLI command handlers
└── lib/
    ├── types.ts        - TypeScript interfaces
    ├── validation.ts   - YAML schema validation
    ├── quiz-file.ts    - YAML file I/O
    ├── google-forms.ts - Google Forms API wrapper
    └── google-auth.ts  - OAuth authentication
```

To contribute:

1. Make changes in `src/`
2. Run `npm run build` to compile
3. Test with `npm run dev -- <command>`
4. Ensure no ESLint errors: `npm run lint`

## Version History

- **1.0.0** (May 21, 2026) - Initial release

---

## Notes on Releases

### Release Process

1. Update version in `package.json`
2. Update this CHANGELOG file
3. Tag release: `git tag v1.0.0`
4. Push: `git push && git push --tags`
5. (Optional) Publish to npm: `npm publish`

### Backwards Compatibility

The YAML format includes `version: 1` for future compatibility. The tool will support version 1 indefinitely and can handle upgraded YAML formats in future versions.

### Support Timeline

- **1.0.x**: Bug fixes and patch releases
- **1.x.x**: Minor features (backwards compatible)
- **2.0.0+**: Major breaking changes allowed
