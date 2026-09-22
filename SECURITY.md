# Security Policy

## BIS Assist

BIS Assist is an academic and research-oriented project designed to assist
users with discovering and understanding information related to Bureau of
Indian Standards (BIS) standards, certification, laboratories, hallmarking,
and consumer-related information.

Security and responsible disclosure are important to the project maintainers.

---

## Supported Versions

Security fixes are primarily provided for the latest version of the project.

| Version | Supported |
|--------|-----------|
| Latest | Yes |
| Older versions | Best effort |
| Unmaintained versions | No |

---

## Reporting a Security Vulnerability

If you discover a security vulnerability in BIS Assist, please do NOT create
a public GitHub issue containing sensitive technical details.

Instead, report the vulnerability privately to the project maintainers.

Please include:

- A short description of the vulnerability
- The affected component or file
- Steps required to reproduce the issue
- Potential security impact
- Proof of concept, if available
- Suggested mitigation, if known

Responsible disclosure helps protect users and maintainers while the issue is
being investigated.

---

## Examples of Security Issues

Examples include, but are not limited to:

- Exposed API keys or credentials
- Hard-coded secrets
- Authentication or authorization vulnerabilities
- Server-side request vulnerabilities
- Remote code execution
- Injection vulnerabilities
- Unsafe file handling
- Path traversal
- Sensitive information disclosure
- Database security issues
- Vulnerabilities in API endpoints
- Improper handling of user-controlled input
- Security weaknesses in external integrations
- Vulnerabilities introduced by project dependencies

---

## Sensitive Information

Do not submit the following information in public issues or pull requests:

- API keys
- Passwords
- Access tokens
- Personal credentials
- Private server information
- Private user data
- Internal infrastructure details

If sensitive information is accidentally committed to the repository, notify
the maintainers immediately.

Simply deleting the file from the latest commit may NOT be sufficient because
the information may remain in Git history.

---

## Responsible Disclosure

Security researchers who responsibly report vulnerabilities are requested to
allow the maintainers reasonable time to investigate and address the issue
before publicly disclosing the vulnerability.

The maintainers will make reasonable efforts to:

1. Confirm the reported vulnerability.
2. Assess its severity and impact.
3. Develop an appropriate fix.
4. Release the fix where practical.
5. Credit the reporter when permission is given.

---

## Security Best Practices for Contributors

Contributors should:

- Never commit secrets or credentials.
- Use environment variables for sensitive configuration.
- Avoid hard-coding API keys.
- Validate and sanitize user-controlled input.
- Keep dependencies reasonably up to date.
- Avoid unnecessary third-party services.
- Follow least-privilege principles.
- Review changes involving authentication, APIs, file handling, and external
  network requests carefully.

---

## AI and RAG Security

BIS Assist uses AI/RAG-related components.

Contributors should take particular care with:

- Prompt injection
- Retrieval poisoning
- Malicious documents
- Untrusted external content
- Model-generated misinformation
- Unauthorized access to retrieved documents
- Sensitive information appearing in prompts or responses

AI-generated responses should not automatically be treated as authoritative
legal, regulatory, engineering, or compliance advice.

Critical BIS requirements should be verified against official BIS publications.

---

## Dependency Security

The project may depend on third-party libraries, frameworks, models, and
services.

Third-party components remain subject to their respective licenses and
security policies.

---

## Contact

For security-related reports, contact the project maintainers through a
private communication channel rather than publicly disclosing the
vulnerability.

Do not use public GitHub issues for undisclosed security vulnerabilities.
