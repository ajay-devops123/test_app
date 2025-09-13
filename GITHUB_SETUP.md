# GitHub Repository Setup Instructions

Follow these steps to create a new GitHub repository and push your code:

## 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and log in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter repository name: `xyz-university-portal`
4. Add a short description: "Student portal web application for XYZ University"
5. Choose "Public" or "Private" visibility as preferred
6. Do NOT initialize with README, .gitignore, or license (we already have these files)
7. Click "Create repository"

## 2. Connect Your Local Repository to GitHub

After creating the repository, GitHub will show commands to push your existing repository.
Run the following commands in PowerShell:

```powershell
# Make sure you're in the correct directory
cd "c:\A SSD NEW WIN\code\test-app\docker-testapp"

# Add the remote GitHub repository
git remote add origin https://github.com/mksinha01/xyz-university-portal.git

# Push your code to GitHub
git push -u origin main
```

You'll be prompted to enter your GitHub username and password or personal access token.

## 3. Verify Your Repository

1. Go to https://github.com/mksinha01/xyz-university-portal
2. You should see all your files uploaded to GitHub

## 4. Share Your Repository

You can now share your GitHub repository URL with others to collaborate on the project.
