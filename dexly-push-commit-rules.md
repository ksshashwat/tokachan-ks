# 🚀 Dexly Push & Commit Rules

## 📋 **Default Branch Strategy**

### **🎯 Primary Development Branch**
- **Default Push Target**: `staging-dexly`
- **Main Branch**: `main` (production-ready code only)
- **Staging Branch**: `staging-dexly` (active development)

### **🔄 Workflow Overview**
```
main (production) ←→ staging-dexly (development) ←→ feature branches
```

## 📝 **Commit Rules**

### **✅ Required Commit Message Format**
```bash
git commit -m "type: Brief description of changes

- Detailed bullet points of changes
- Any breaking changes or important notes
- Related issue numbers or references"
```

### **🏷️ Commit Type Prefixes**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style/formatting changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### **📦 Commit Examples**
```bash
# Feature addition
git commit -m "feat: Add user profile management

- Implement profile editing interface
- Add avatar upload functionality
- Integrate with Supabase storage
- Add form validation and error handling"

# Bug fix
git commit -m "fix: Resolve note deletion delay issue

- Move delete API call to modal confirmation
- Remove animation dependency for deletion
- Add immediate state updates
- Fix race condition in delete flow"
```

## 🚀 **Push Rules**

### **🎯 Default Push Target**
**ALWAYS push to `staging-dexly` by default:**

```bash
# ✅ CORRECT - Push to staging
git push origin staging-dexly

# ❌ INCORRECT - Don't push directly to main
git push origin main
```

### **📋 Push Workflow**
1. **Create feature branch** (if needed)
2. **Make changes** and commit with proper format
3. **Push to staging** → `git push origin staging-dexly`
4. **Test on staging** environment
5. **Wait for merge approval** before touching main

### **🔄 Branch Management**
```bash
# Start new feature
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push to staging (default)
git push origin staging-dexly

# OR push feature branch
git push origin feature/new-feature
```

## 🔒 **Main Branch Protection**

### **🚫 No Direct Main Pushes**
- **Main branch is protected** from direct pushes
- **All changes must go through staging first**
- **Main only accepts merges from staging**
- **No hotfixes directly to main**

### **✅ Main Branch Rules**
```bash
# ❌ NEVER do this
git push origin main

# ✅ ONLY merge from staging when approved
git checkout main
git merge staging-dexly
git push origin main
```

## 🔄 **Staging to Main Sync Process**

### **📋 Sync Requirements**
Before merging `staging-dexly` to `main`:

1. **✅ All tests passing**
2. **✅ Code review completed**
3. **✅ Staging environment tested**
4. **✅ Documentation updated**
5. **✅ Explicit approval given**

### **🔄 Sync Commands**
```bash
# Only run when explicitly instructed to sync
git checkout main
git pull origin main
git merge staging-dexly
git push origin main

# Optional: Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 🚨 **Emergency Procedures**

### **🔥 Hotfix Process**
If critical fixes are needed on main:

1. **Create hotfix branch from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-fix
   ```

2. **Make minimal fix**
   ```bash
   git add .
   git commit -m "fix: Critical security patch"
   ```

3. **Merge to both branches**
   ```bash
   # Merge to main
   git checkout main
   git merge hotfix/critical-fix
   git push origin main
   
   # Merge to staging
   git checkout staging-dexly
   git merge hotfix/critical-fix
   git push origin staging-dexly
   ```

## 📊 **Branch Status Tracking**

### **🎯 Current Branch Status**
- **Main**: Production-ready, stable code
- **Staging-dexly**: Active development, latest features
- **Feature branches**: Individual feature development

### **📈 Development Flow**
```
Feature Branch → staging-dexly → main (when approved)
```

## 🔧 **Git Configuration**

### **⚙️ Recommended Git Config**
```bash
# Set staging as default push target
git config push.default upstream

# Set staging-dexly as default branch
git config init.defaultBranch staging-dexly

# Enable helpful git features
git config core.autocrlf input
git config core.safecrlf warn
```

## 📋 **Daily Workflow Checklist**

### **🌅 Morning Setup**
- [ ] `git checkout staging-dexly`
- [ ] `git pull origin staging-dexly`
- [ ] Check for any new changes

### **💻 During Development**
- [ ] Make changes
- [ ] Test locally
- [ ] Commit with proper format
- [ ] Push to `staging-dexly`

### **🌙 End of Day**
- [ ] Ensure all changes are pushed to staging
- [ ] Update any documentation
- [ ] Create issues for next day if needed

## 🚨 **Important Reminders**

### **⚠️ Never Forget**
1. **Always push to `staging-dexly` by default**
2. **Never push directly to `main`**
3. **Wait for explicit merge instructions**
4. **Use proper commit message format**
5. **Test on staging before requesting main merge**

### **📞 When to Request Main Merge**
- All features are complete and tested
- Staging environment is stable
- Documentation is updated
- Team approval is received
- **Explicit instruction is given**

---

## 📝 **Document Version**
- **Version**: 1.0
- **Last Updated**: Current
- **Next Review**: When workflow changes are needed

---

**Remember: Staging is your friend, Main is your boss! 🎯** 