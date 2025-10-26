# Manual Testing Guide

This guide provides step-by-step instructions for manually testing all features of the AutoIGDM Pro platform.

## Prerequisites

Before testing, ensure:
- Backend server is running on `http://localhost:5000`
- Frontend server is running on `http://localhost:3000`
- MongoDB is running and accessible
- You have a fresh database (or are prepared to clean up test data)

## Test Scenarios

### Test 1: User Registration ✅

**Steps:**
1. Navigate to `http://localhost:3000`
2. You should be redirected to the login page
3. Click "Sign Up" link
4. Fill in the registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
5. Click "Sign Up" button

**Expected Results:**
- ✅ User is created successfully
- ✅ User is automatically logged in
- ✅ Redirected to dashboard
- ✅ See "Test User" in the navbar
- ✅ Dashboard shows 0 campaigns, 0 leads, 0 messages

**API Test (Alternative):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

---

### Test 2: User Login ✅

**Steps:**
1. Log out from the current session (click "Logout" in navbar)
2. You should be redirected to login page
3. Fill in the login form:
   - Email: "test@example.com"
   - Password: "password123"
4. Click "Sign In" button

**Expected Results:**
- ✅ User is authenticated successfully
- ✅ Redirected to dashboard
- ✅ Token stored in localStorage
- ✅ See "Test User" in navbar

**API Test (Alternative):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

### Test 3: Add Instagram Account ✅

**Steps:**
1. From the dashboard, click "Instagram Accounts" in navbar
2. Click "+ Add Account" button
3. Fill in the form:
   - Username: "my_fitness_brand"
   - Display Name: "My Fitness Brand"
4. Read the demo mode notice
5. Click "Add Account" button

**Expected Results:**
- ✅ Account is created successfully
- ✅ Form closes automatically
- ✅ New account appears in the list
- ✅ Account shows "Active" status
- ✅ Account shows username "@my_fitness_brand"
- ✅ Account shows display name "My Fitness Brand"

**API Test (Alternative):**
```bash
# Replace YOUR_TOKEN with the token from login
curl -X POST http://localhost:5000/api/instagram \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "username": "my_fitness_brand",
    "displayName": "My Fitness Brand"
  }'
```

---

### Test 4: Create Campaign (With Auto-Lead Generation) ✅

**Steps:**
1. Click "Campaigns" in navbar
2. Click "+ Create Campaign" button
3. Fill in the form:
   - Campaign Name: "Fitness Outreach Q1"
   - Instagram Account: Select "my_fitness_brand - My Fitness Brand"
   - Target Audience: "fitness enthusiasts and gym-goers"
4. Click "Create Campaign" button

**Expected Results:**
- ✅ Campaign is created successfully
- ✅ Form closes automatically
- ✅ New campaign appears in the list with "draft" status
- ✅ Campaign shows AI-generated message
- ✅ Click "View Details" to verify leads were generated

**Verify Auto-Generated Leads:**
1. Click "View Details" on the campaign
2. Click "Leads" tab (should show "Leads (3)")

**Expected Lead Results:**
- ✅ Exactly 3 leads are shown
- ✅ Lead 1: @fitness_lover_22 - Fitness Lover (Demo badge)
- ✅ Lead 2: @healthy_lifestyle - Healthy Lifestyle (Demo badge)
- ✅ Lead 3: @workout_daily - Workout Daily (Demo badge)
- ✅ All leads show current timestamp
- ✅ All leads have "Demo" badge

**Expected Messages Tab:**
- ✅ Click "Messages" tab (should show "Messages (0)")
- ✅ Empty state shown: "No messages sent yet"
- ✅ Text says "Activate the campaign to send demo messages"

---

### Test 5: Activate Campaign (Auto-Send Messages) ✅ 🎉

**This is the key feature to test!**

**Steps:**
1. Navigate to Campaigns page
2. Find the "Fitness Outreach Q1" campaign
3. Click "Activate" button
4. Wait for the request to complete

**Expected Results:**
- ✅ Campaign status changes from "draft" to "active" (green badge)
- ✅ "Activate" button disappears
- ✅ "Pause" button appears instead
- ✅ Dashboard updates showing 1 active campaign

**Verify Messages Were Sent:**
1. Click "View Details" on the campaign
2. Click "Messages" tab (should now show "Messages (3)")

**Expected Message Results:**
- ✅ Exactly 3 messages are shown
- ✅ Each message shows:
  - Recipient username (To: @fitness_lover_22, etc.)
  - Personalized AI-generated content
  - Status: "sent" (green badge)
  - Timestamp of when sent
  - "(Demo)" indicator
- ✅ Messages are different for each lead (personalized)
- ✅ Messages relate to the target audience "fitness enthusiasts"

**Example Messages You Might See:**
```
To: @fitness_lover_22
"Hi Fitness Lover! Your dedication to fitness is inspiring! Let's connect!"
Sent: [timestamp] (Demo)
Status: sent

To: @healthy_lifestyle
"Hi Healthy Lifestyle! Love your approach to wellness. Would love to share ideas!"
Sent: [timestamp] (Demo)
Status: sent

To: @workout_daily
"Hi Workout Daily! Your consistency is amazing! Let's connect and grow together!"
Sent: [timestamp] (Demo)
Status: sent
```

**API Test (Alternative):**
```bash
# Replace YOUR_TOKEN and CAMPAIGN_ID
curl -X POST http://localhost:5000/api/campaigns/CAMPAIGN_ID/activate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Test 6: View Campaign Details ✅

**Steps:**
1. From Campaigns page, click "View Details"
2. Review all campaign information

**Expected Results:**
- ✅ Campaign name shown: "Fitness Outreach Q1"
- ✅ Status badge shows "active" (green)
- ✅ Instagram account shown: "@my_fitness_brand - My Fitness Brand"
- ✅ Target audience shown: "fitness enthusiasts and gym-goers"
- ✅ Created timestamp shown
- ✅ Activated timestamp shown (after activation)
- ✅ AI Generated Message displayed in gray box

**Tab Navigation:**
- ✅ Two tabs visible: "Leads (3)" and "Messages (3)"
- ✅ Active tab highlighted in blue
- ✅ Clicking tabs switches content

---

### Test 7: Dashboard Analytics ✅

**Steps:**
1. Navigate to Dashboard
2. Review all statistics

**Expected Results:**
- ✅ Total Campaigns: 1
- ✅ Active Campaigns: 1
- ✅ Total Leads: 3
- ✅ Messages Sent: 3

**Recent Campaigns Section:**
- ✅ Shows "Fitness Outreach Q1" campaign
- ✅ Shows status as "active"
- ✅ Shows target audience
- ✅ Shows creation date
- ✅ Click on campaign name navigates to details

---

### Test 8: Campaign Pause ✅

**Steps:**
1. Navigate to Campaigns page
2. Click "Pause" button on active campaign

**Expected Results:**
- ✅ Campaign status changes to "paused" (gray badge)
- ✅ "Pause" button becomes "Activate" button
- ✅ Dashboard updates: Active Campaigns: 0

---

### Test 9: Multiple Campaigns ✅

**Steps:**
1. Create a second campaign:
   - Name: "Wellness Outreach"
   - Same Instagram account
   - Target: "health coaches and nutritionists"
2. Activate the second campaign

**Expected Results:**
- ✅ First campaign: 3 leads, 3 messages
- ✅ Second campaign: 3 NEW leads (different instances), 3 NEW messages
- ✅ Dashboard shows: 2 campaigns, 1 active, 6 leads, 6 messages
- ✅ Each campaign has independent leads and messages

---

### Test 10: Campaign Deletion ✅

**Steps:**
1. Navigate to Campaigns page
2. Click "Delete" button on a campaign
3. Confirm deletion in the dialog

**Expected Results:**
- ✅ Campaign is deleted
- ✅ Associated leads are deleted
- ✅ Associated messages are deleted
- ✅ Dashboard statistics update accordingly
- ✅ Campaign no longer appears in list

---

### Test 11: Instagram Account Deletion ✅

**Steps:**
1. Navigate to Instagram Accounts page
2. Click "Delete" button on an account
3. Confirm deletion

**Expected Results:**
- ✅ Account is deleted if no campaigns use it
- ✅ OR Error if campaigns exist using this account (delete campaigns first)

---

### Test 12: Authentication Flow ✅

**Test Protected Routes:**
1. Log out of the application
2. Try to access: `http://localhost:3000/dashboard`

**Expected Results:**
- ✅ Redirected to login page
- ✅ Cannot access protected routes without authentication

**Test Authenticated Routes:**
1. Log in to the application
2. Try to access: `http://localhost:3000/login`

**Expected Results:**
- ✅ Redirected to dashboard
- ✅ Cannot access login/register when authenticated

---

### Test 13: Input Validation ✅

**Test Registration Validation:**
1. Try to register with:
   - Invalid email: "notanemail"
   - Short password: "12345" (< 6 chars)
   - Empty name

**Expected Results:**
- ✅ Form validation prevents submission
- ✅ Error messages shown
- ✅ User not created

**Test Campaign Validation:**
1. Try to create campaign with:
   - Empty name
   - No Instagram account selected
   - Empty target audience

**Expected Results:**
- ✅ Form validation prevents submission
- ✅ Required field errors shown

---

### Test 14: Error Handling ✅

**Test Invalid Login:**
1. Try to login with wrong password

**Expected Results:**
- ✅ Error message: "Invalid credentials"
- ✅ User not logged in

**Test Duplicate Email:**
1. Try to register with already existing email

**Expected Results:**
- ✅ Error message: "User already exists"
- ✅ Registration fails

---

## Performance Tests

### Test 15: AI Message Generation ⏱️

**Monitor Response Time:**
1. Create a campaign and observe time taken
2. Activate a campaign and observe time taken

**Expected Results:**
- ✅ Campaign creation: < 5 seconds (includes AI call)
- ✅ Campaign activation: < 10 seconds (3 AI calls for personalization)
- ✅ Fallback messages work if OpenAI API is unavailable

---

## Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

All features should work consistently across browsers.

---

## Mobile Responsiveness

Test on mobile devices or browser responsive mode:
- ✅ Layout adapts to small screens
- ✅ Navigation is accessible
- ✅ Forms are usable
- ✅ Tables/lists are readable

---

## Test Summary Checklist

After completing all tests, verify:

- [ ] User can register and login
- [ ] User can add Instagram accounts
- [ ] User can create campaigns
- [ ] **3 demo leads are auto-generated on campaign creation**
- [ ] **Messages are auto-sent when campaign is activated**
- [ ] Messages appear in the Messages tab
- [ ] All messages are personalized and different
- [ ] Dashboard shows accurate statistics
- [ ] Campaign status can be changed (activate/pause)
- [ ] Data can be deleted (campaigns, accounts)
- [ ] Authentication protects routes
- [ ] Input validation works
- [ ] Error handling works
- [ ] UI is responsive

---

## Reporting Issues

If any test fails:
1. Note the test number and step
2. Capture any error messages
3. Check browser console for errors
4. Check backend terminal for errors
5. Verify MongoDB is running and accessible

---

## Success Criteria

The implementation is successful if:
✅ All 14 test scenarios pass
✅ Auto-lead generation works (Test 4)
✅ Auto-message sending works (Test 5)
✅ Messages are personalized and tracked
✅ No console errors during normal operation
✅ All security features work as expected

---

## Next Steps After Testing

If all tests pass:
1. Review the codebase structure
2. Read ARCHITECTURE.md for system design
3. Read SECURITY.md for production considerations
4. Consider implementing real Instagram Graph API integration
5. Add additional features as needed