# Security Policy

## 🔒 Supported Versions

This project is currently in active development. Security updates will be applied to:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## 🛡️ Security Considerations

### Data Privacy

This application:
- Stores all data in Google Sheets under your Google account
- Does not transmit data to third-party servers
- Uses Google's built-in authentication and encryption
- Requires explicit user authorization for access

### What We Do

- ✅ Server-side input validation
- ✅ Input sanitization to prevent XSS
- ✅ Google OAuth2 authentication
- ✅ HTTPS-only connections (enforced by Google Apps Script)
- ✅ No password storage (Google handles authentication)

### What You Should Do

**When Deploying:**
- 🔐 Set appropriate access permissions (who can access the web app)
- 🔐 Limit Google Sheet sharing to authorized users only
- 🔐 Regularly review Apps Script permissions
- 🔐 Use separate spreadsheets for production vs. testing

**Best Practices:**
- Don't share your deployment URL publicly if it contains sensitive data
- Don't grant edit access to the Google Sheet to untrusted users
- Review Apps Script execution logs periodically
- Keep sample/demo deployments separate from production

## 🚨 Reporting a Vulnerability

**Please DO NOT report security vulnerabilities through public GitHub issues.**

### How to Report

If you discover a security vulnerability, please report it by:

1. **GitHub Security Advisories** (Preferred):
   - Go to the repository's Security tab
   - Click "Report a vulnerability"
   - Fill out the private security advisory form

2. **Direct Contact**:
   - Send an email with details to the project maintainer
   - Include "SECURITY" in the subject line

### What to Include

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)
- Your contact information

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Regular Updates**: Every 7 days until resolved
- **Disclosure**: Coordinated disclosure after fix is deployed

## 🔍 Security Audit Checklist

For deployments, ensure:

- [ ] Only authorized users have access to the web app
- [ ] Google Sheet permissions are restricted
- [ ] Apps Script authorization is understood
- [ ] No sensitive data in code comments
- [ ] Input validation is enabled
- [ ] Regular backups are performed
- [ ] Audit logs are reviewed periodically

## 📝 Known Limitations

### By Design

- User authentication relies on Google's OAuth2
- Data residency is determined by Google Sheets storage location
- Apps Script execution quotas apply (see Google's documentation)

### Not Applicable

This application does NOT:
- Store passwords
- Process payment information
- Transmit data outside Google's infrastructure
- Use third-party analytics or tracking

## 🔄 Security Updates

Security patches will be:
- Released as soon as possible after discovery
- Documented in release notes
- Announced in the repository README

## 📚 Additional Resources

- [Google Apps Script Security Best Practices](https://developers.google.com/apps-script/guides/security)
- [Google Workspace Security](https://workspace.google.com/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## ✅ Responsible Disclosure

We appreciate responsible disclosure of security issues. Contributors who report valid security vulnerabilities will be:
- Acknowledged (with permission)
- Credited in release notes
- Added to the SECURITY.md Hall of Fame (optional)

---

**Last Updated**: November 2025
