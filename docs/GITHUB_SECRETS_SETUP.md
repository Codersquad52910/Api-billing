# 🔐 GitHub Secrets Setup Guide

This project uses **GitHub Secrets** to securely manage credentials. No secrets are hardcoded in the codebase.

## Required Secrets

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Add the following secrets:

### Docker Hub (Required for Deploy stage)

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | [hub.docker.com](https://hub.docker.com/) account |
| `DOCKERHUB_TOKEN` | Docker Hub access token | Docker Hub → Account Settings → Security → New Access Token |

### Application (Optional — used in production deploy)

| Secret Name | Value | Example |
|-------------|-------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | JWT signing secret | Any long random string |

## Local Development

For local development, copy the environment template:

```bash
cp backend/.env.example backend/.env
```

Then fill in your local values. The `.env` file is excluded from Git via `.gitignore`.

## How Secrets Are Used

### In GitHub Actions (`.github/workflows/ci.yml`):
```yaml
# Docker Hub login
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

### In Docker Compose (`docker-compose.yml`):
```yaml
environment:
  - JWT_SECRET=${JWT_SECRET:-default_value}
  - MONGO_URI=mongodb://mongodb:27017/api_dashboard
```

## Security Checklist

- [x] `.env` excluded from version control via `.gitignore`
- [x] `.env.example` provided as template (no real values)
- [x] All secrets injected via GitHub Secrets in CI/CD
- [x] Docker Compose uses environment variable substitution
- [x] No credentials hardcoded anywhere in source code
