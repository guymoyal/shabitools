# Custom Domain Setup for shabitools.com

## Problem: Custom domain not working

If your site works on `*.pages.dev` but not on `shabitools.com`, it's usually a DNS issue.

---

## Step 1: Check Custom Domain in Cloudflare Pages

### Direct Link:
👉 **https://dash.cloudflare.com/pages/view/shabitools/settings/domains**

**What to check:**
1. ✅ Is `shabitools.com` listed under "Custom domains"?
2. ✅ Status should be "Active" (green checkmark)
3. ✅ Production branch should be set to `main`

**If domain is NOT listed:**
1. Click **"Add a custom domain"**
2. Enter: `shabitools.com`
3. Click **"Continue"**
4. Follow DNS setup instructions

---

## Step 2: Check DNS Records

### Direct Link:
👉 **https://dash.cloudflare.com/dns**

**Select your domain:** `shabitools.com`

### Required DNS Records:

You need **ONE** of these setups:

#### Option A: CNAME Record (Recommended)

**Record Type:** `CNAME`  
**Name:** `@` (or root domain)  
**Target:** `shabitools.pages.dev`  
**Proxy status:** ✅ Proxied (orange cloud)

**OR**

**Record Type:** `CNAME`  
**Name:** `@`  
**Target:** `main.shabitools.pages.dev`  
**Proxy status:** ✅ Proxied (orange cloud)

#### Option B: A Record (If CNAME doesn't work)

**Record Type:** `A`  
**Name:** `@`  
**IPv4 address:** `192.0.2.1` (Cloudflare Pages IP - check dashboard)  
**Proxy status:** ✅ Proxied (orange cloud)

**Note:** Cloudflare Pages will show you the exact IP address when you add the custom domain.

---

## Step 3: Verify DNS Propagation

### Check if DNS is resolving:

```bash
# Check DNS records
dig shabitools.com
# OR
nslookup shabitools.com

# Check CNAME
dig CNAME shabitools.com
```

**Expected output:**
- Should point to `shabitools.pages.dev` or similar
- Should resolve to Cloudflare IPs

### Online DNS Checker:
👉 **https://dnschecker.org/#CNAME/shabitools.com**

---

## Step 4: Common DNS Issues

### Issue 1: Wrong Record Type

❌ **Wrong:** A record pointing to wrong IP  
✅ **Correct:** CNAME to `shabitools.pages.dev`

### Issue 2: Not Proxied

❌ **Wrong:** DNS record with gray cloud (DNS only)  
✅ **Correct:** DNS record with orange cloud (Proxied)

**Fix:** Click the gray cloud icon to make it orange (Proxied)

### Issue 3: Wrong Target

❌ **Wrong:** CNAME to `shabitools.com` (circular)  
✅ **Correct:** CNAME to `shabitools.pages.dev`

### Issue 4: Missing WWW Subdomain

If you want `www.shabitools.com` to work:

**Add another CNAME:**
- **Name:** `www`
- **Target:** `shabitools.pages.dev`
- **Proxy:** ✅ Proxied

---

## Step 5: Check SSL/TLS Settings

### Direct Link:
👉 **https://dash.cloudflare.com/ssl-tls**

**Select domain:** `shabitools.com`

**Settings:**
- ✅ **SSL/TLS encryption mode:** Full (strict) or Full
- ✅ **Always Use HTTPS:** ON
- ✅ **Automatic HTTPS Rewrites:** ON

**Wait 5-10 minutes** for SSL certificate to provision.

---

## Step 6: Verify Custom Domain Status

### In Cloudflare Pages Dashboard:

👉 **https://dash.cloudflare.com/pages/view/shabitools/settings/domains**

**Check:**
- ✅ Domain shows "Active" status
- ✅ No error messages
- ✅ SSL certificate status (should show "Active" or "Provisioning")

**If status shows "Pending" or "Error":**
1. Check DNS records (Step 2)
2. Wait 5-10 minutes for propagation
3. Check SSL/TLS settings (Step 5)

---

## Step 7: Force HTTPS Redirect

### In Cloudflare Dashboard:

👉 **https://dash.cloudflare.com/rules/page-rules**

**Create Page Rule:**
- **URL:** `http://shabitools.com/*`
- **Setting:** Always Use HTTPS
- **Status:** Enabled

**OR use Redirect Rules:**

👉 **https://dash.cloudflare.com/rules/redirect-rules**

**Create Redirect:**
- **Name:** HTTP to HTTPS
- **If:** `http://shabitools.com/*`
- **Then:** Redirect to `https://shabitools.com/$1`
- **Status Code:** 301 (Permanent)

---

## Step 8: Check Browser Cache

Sometimes it's just browser cache:

1. **Hard refresh:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Clear cache:** Browser settings → Clear browsing data
3. **Try incognito/private mode**
4. **Try different browser**

---

## Step 9: Verify Deployment

Make sure your latest deployment is on the production branch:

👉 **https://dash.cloudflare.com/pages/view/shabitools**

1. Check **"Deployments"** tab
2. Latest deployment should be on `main` branch
3. Status should be "Success"

---

## Quick Checklist:

- [ ] Custom domain added in Pages: https://dash.cloudflare.com/pages/view/shabitools/settings/domains
- [ ] DNS CNAME record exists: `@` → `shabitools.pages.dev`
- [ ] DNS record is Proxied (orange cloud)
- [ ] Production branch set to `main`
- [ ] SSL/TLS mode is "Full" or "Full (strict)"
- [ ] SSL certificate is Active/Provisioning
- [ ] Latest deployment is successful
- [ ] Waited 5-10 minutes for DNS/SSL propagation

---

## Most Common Fix:

**1. Add CNAME record:**
- Go to: https://dash.cloudflare.com/dns
- Add: `CNAME` → `@` → `shabitools.pages.dev` → ✅ Proxied

**2. Wait 5-10 minutes**

**3. Check domain status:**
- Go to: https://dash.cloudflare.com/pages/view/shabitools/settings/domains
- Should show "Active"

---

## Still Not Working?

### Check DNS Propagation:
👉 https://dnschecker.org/#CNAME/shabitools.com

### Check SSL Certificate:
👉 https://www.ssllabs.com/ssltest/analyze.html?d=shabitools.com

### Cloudflare Support:
👉 https://dash.cloudflare.com/support

---

## Expected DNS Configuration:

```
Type    Name    Content                    Proxy
CNAME   @       shabitools.pages.dev       ✅ Proxied
CNAME   www     shabitools.pages.dev       ✅ Proxied (optional)
```

This is the standard setup for Cloudflare Pages custom domains!
