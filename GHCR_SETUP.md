# GitHub Container Registry (GHCR) Setup

This project is configured to automatically build and push Docker images to GitHub Container Registry (GHCR) using GitHub Actions.

## Overview

- **Registry**: `ghcr.io`
- **Image Name**: `ghcr.io/mksinha01/docker-testapp`
- **Automated Builds**: Triggered on push to `main` branch and tags

## How It Works

1. **GitHub Actions Workflow**: `.github/workflows/docker-publish.yml`
   - Builds Docker image on every push to `main`
   - Pushes to GHCR with multiple tags
   - Signs images with Cosign for security
   - Supports multi-platform builds (linux/amd64, linux/arm64)

2. **Docker Image Tags**:
   - `latest`: Always points to the latest main branch
   - `main`: Current main branch
   - `v1.2.3`: Semantic version tags
   - `pr-123`: Pull request builds (not pushed to registry)

## Using the Image

### Pull and Run
```bash
# Pull the latest image
docker pull ghcr.io/mksinha01/docker-testapp:latest

# Run the container
docker run -p 5050:5050 ghcr.io/mksinha01/docker-testapp:latest
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    image: ghcr.io/mksinha01/docker-testapp:latest
    ports:
      - "5050:5050"
    environment:
      - NODE_ENV=production
```

### Local Development
```bash
# Build locally
docker build -t my-app .

# Run locally built image
docker run -p 5050:5050 my-app
```

## Package Visibility

By default, GHCR packages are private. To make your package public:

1. Go to your repository on GitHub
2. Click on "Packages" in the right sidebar
3. Click on your package name
4. Go to "Package settings"
5. Scroll down to "Danger Zone"
6. Click "Change package visibility" → "Public"

## Authentication

### For Public Images
No authentication needed for pulling public images.

### For Private Images
```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Or using GitHub CLI
gh auth token | docker login ghcr.io -u USERNAME --password-stdin
```

## Security Features

- **Non-root user**: Container runs as `appuser` (UID 1001)
- **Security updates**: Alpine packages are updated during build
- **Image signing**: Images are signed with Cosign
- **Health checks**: Built-in health check endpoint
- **Multi-stage builds**: Optimized for production

## Triggering Builds

### Automatic Builds
- Push to `main` branch
- Create a new tag (e.g., `git tag v1.0.0 && git push origin v1.0.0`)

### Manual Builds
1. Go to Actions tab in your GitHub repository
2. Select "Build and Push to GHCR" workflow
3. Click "Run workflow"

## Monitoring

- Check build status in the "Actions" tab
- View published packages in the "Packages" section of your repository
- Health check endpoint: `http://localhost:5050/health`

## Troubleshooting

### Build Failures
- Check the Actions tab for detailed logs
- Ensure Dockerfile syntax is correct
- Verify all dependencies are available

### Permission Issues
- Ensure your repository has package write permissions
- Check that `GITHUB_TOKEN` has the required scopes

### Image Pull Issues
- Verify package visibility settings
- Check authentication for private packages
- Ensure correct image name and tag