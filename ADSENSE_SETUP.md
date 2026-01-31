# AdSense Setup Guide

## ✅ What's Already Done

- ✅ AdSense script added to layout (`components/Ads/AutoAds.tsx`)
- ✅ Publisher ID configured: `ca-pub-2858012859068424`
- ✅ Auto Ads enabled (Google places ads automatically)

---

## 🎯 How AdSense Works Now

### Auto Ads (Currently Active)
- **No configuration needed** - Google automatically places ads
- Ads appear in optimal locations
- Works immediately after AdSense approval

### Manual Ad Units (Optional - For More Control)
If you want to control ad placement manually:

1. **Create Ad Units in AdSense Dashboard**
   - Go to: https://www.google.com/adsense
   - Ads → By ad unit → New ad unit
   - Create units like:
     - Header Banner (728x90)
     - Sidebar Rectangle (300x250)
     - In-Article (responsive)

2. **Get Ad Slot IDs**
   - Copy the ad slot ID (format: `1234567890`)

3. **Add to Pages**
   ```tsx
   import { AdBanner } from '@/components/Ads';
   
   <AdBanner adSlot="YOUR_AD_SLOT_ID" />
   ```

---

## 📍 Current Ad Placements

### Auto Ads (Active)
- Google automatically places ads in optimal locations
- No manual configuration needed

### Manual Ads (Ready to Use)
Components are ready but need ad slot IDs:
- `AdBanner` - For banner ads
- `AdSidebar` - For sidebar ads

---

## ⏱️ Timeline

1. **Now**: Script is added, waiting for AdSense approval
2. **24-48 hours**: After approval, ads start appearing
3. **1-2 weeks**: Revenue optimization begins

---

## 🔍 Testing

### Check if AdSense Script Loads

1. Open your site in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for: `adsbygoogle.js` loaded
5. Check Network tab for AdSense requests

### Check AdSense Dashboard

1. Go to: https://www.google.com/adsense
2. Check "Sites" section
3. Verify your site is listed
4. Check approval status

---

## 📊 Ad Placement Strategy

### Recommended (When Using Manual Ads)

1. **Header Banner** - After navigation (728x90)
2. **Between Tools** - In tools listing (responsive)
3. **Sidebar** - On tool pages (300x250)
4. **Footer** - Above footer (728x90)

**Max 3-4 ads per page** (AdSense policy)

---

## 🚨 Important Notes

1. **Auto Ads is Active** - Google will place ads automatically
2. **Wait for Approval** - Ads may take 24-48 hours to appear
3. **Don't Click Your Own Ads** - Violates AdSense policy
4. **Test Without Ad Blockers** - Ads won't show with blockers

---

## ✅ Next Steps

1. **Deploy your site** (see DEPLOYMENT_STEPS.md)
2. **Wait for AdSense approval** (if not already approved)
3. **Monitor AdSense dashboard** for ad performance
4. **Optional**: Create manual ad units for more control

---

**Status**: ✅ AdSense script implemented and ready!
