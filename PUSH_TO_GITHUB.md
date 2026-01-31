# Push to GitHub - Instructions

## ✅ Remote Repository Connected

Your local repository is now connected to:
**https://github.com/guymoyal/shabitools.git**

---

## 🚀 Push Your Code to GitHub

### Option 1: Using HTTPS (Will prompt for credentials)

```bash
# Push to GitHub
git push -u origin main
```

**You'll be prompted for:**
- Username: `guymoyal`
- Password: Use a **Personal Access Token** (not your GitHub password)

### Option 2: Using SSH (Recommended - No password needed)

#### Step 1: Switch to SSH URL

```bash
# Remove HTTPS remote
git remote remove origin

# Add SSH remote
git remote add origin git@github.com:guymoyal/shabitools.git

# Push
git push -u origin main
```

#### Step 2: Set up SSH Key (if not already done)

```bash
# Check if you have SSH key
ls -la ~/.ssh/id_rsa.pub

# If not, generate one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_rsa.pub

# Add to GitHub: https://github.com/settings/keys
```

### Option 3: Use GitHub CLI (Easiest)

```bash
# Install GitHub CLI (if not installed)
# brew install gh

# Login
gh auth login

# Push
git push -u origin main
```

---

## 🔐 Get Personal Access Token (For HTTPS)

If using HTTPS, you need a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `shabitools-deploy`
4. Select scopes: `repo` (full control)
5. Generate token
6. Copy token (save it - you won't see it again!)
7. Use this token as password when pushing

---

## ✅ After Pushing

Once pushed, you'll see all your files at:
**https://github.com/guymoyal/shabitools**

---

## 🎯 Quick Commands

```bash
# Check remote
git remote -v

# Push to GitHub
git push -u origin main

# Check status
git status
```

---

**Choose the method that works best for you and push your code!**
