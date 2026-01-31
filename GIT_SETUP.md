# Git Setup Guide for shabitools

## ✅ Current Status

Git is already initialized in your project. Here's how to connect it to a remote repository:

---

## 🚀 Option 1: Connect to GitHub (Recommended)

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `shabitools`
3. Description: "Free web tools for developers"
4. Choose: Public or Private
5. **Don't** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shabitools.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/shabitools.git
```

### Step 3: Stage and Commit All Files

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: shabitools website with 28 tools, AdSense, and Buy Me a Coffee"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 Option 2: Connect to GitLab

### Step 1: Create GitLab Repository

1. Go to: https://gitlab.com/projects/new
2. Create new project
3. Name: `shabitools`
4. Choose visibility
5. **Don't** initialize with README

### Step 2: Connect

```bash
git remote add origin https://gitlab.com/YOUR_USERNAME/shabitools.git
git branch -M main
git push -u origin main
```

---

## 🚀 Option 3: Connect to Bitbucket

### Step 1: Create Bitbucket Repository

1. Go to: https://bitbucket.org/repo/create
2. Create repository: `shabitools`
3. Choose visibility

### Step 2: Connect

```bash
git remote add origin https://bitbucket.org/YOUR_USERNAME/shabitools.git
git branch -M main
git push -u origin main
```

---

## 📋 Quick Setup Commands

### If you already have a remote repository:

```bash
# Check current remotes
git remote -v

# Add remote (if not exists)
git remote add origin YOUR_REPOSITORY_URL

# Stage all files
git add .

# Commit
git commit -m "Initial commit: shabitools website"

# Push
git branch -M main
git push -u origin main
```

---

## 🔧 Git Configuration (If Needed)

### Set your name and email:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Or set globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📝 Recommended .gitignore

Your `.gitignore` is already set up correctly! It includes:
- ✅ `node_modules/`
- ✅ `.next/` and `out/`
- ✅ `.env` files
- ✅ Test results
- ✅ Build artifacts

---

## 🎯 Next Steps After Connecting

1. **Push your code** to remote repository
2. **Connect Cloudflare Pages to Git** (optional but recommended)
   - Go to Cloudflare Pages dashboard
   - Connect to Git repository
   - Auto-deploy on push

3. **Set up CI/CD** (optional)
   - Automatic deployments on git push
   - Run tests before deployment

---

## 🔍 Check Current Status

```bash
# Check if git is initialized
git status

# Check remotes
git remote -v

# Check branch
git branch

# Check commits
git log --oneline
```

---

## 💡 Tips

1. **Commit often** - Small, frequent commits are better
2. **Use meaningful commit messages** - Describe what changed
3. **Don't commit sensitive data** - `.env` files are already ignored
4. **Push regularly** - Keep remote repository up to date

---

## 🚨 Important Files to Commit

✅ **Do commit:**
- All source code (`app/`, `components/`, etc.)
- Configuration files (`package.json`, `next.config.js`, etc.)
- Documentation (`README.md`, `*.md` files)
- Public assets (`public/`)

❌ **Don't commit** (already in .gitignore):
- `node_modules/`
- `.next/` and `out/`
- `.env` files
- Test results
- Build artifacts

---

**Ready to connect? Follow the steps above for your preferred Git hosting service!**
