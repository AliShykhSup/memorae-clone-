# Quick Start Guide - AutoIGDM Pro

This guide will help you get the AutoIGDM Pro platform up and running quickly.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or use MongoDB Atlas)
- OpenAI API key (optional - system works without it)

## Setup Steps

### 1. Install Dependencies

```bash
# Install all dependencies (both backend and frontend)
npm run install:all
```

Or install separately:

```bash
# Backend only
cd backend
npm install

# Frontend only
cd frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/autoigdm
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
NODE_ENV=development
```

**Note:** The system works without an OpenAI API key - it will use fallback messages.

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, update the `MONGO_URI` in your `.env` file.

### 4. Start the Application

**Option A: Start both servers separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: Use the root scripts**

Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev:frontend
```

### 5. Access the Application

Open your browser and navigate to: `http://localhost:3000`

## Testing the Features

### Step 1: Register an Account

1. Click "Sign Up" on the login page
2. Enter your name, email, and password (min 6 characters)
3. You'll be automatically logged in and redirected to the dashboard

### Step 2: Add Instagram Account

1. Navigate to "Instagram Accounts" from the navbar
2. Click "+ Add Account"
3. Enter any username (e.g., "my_fitness_brand")
4. Enter a display name (e.g., "My Fitness Brand")
5. Click "Add Account"

### Step 3: Create a Campaign

1. Navigate to "Campaigns" from the navbar
2. Click "+ Create Campaign"
3. Fill in the form:
   - **Campaign Name**: e.g., "Fitness Outreach Q1"
   - **Instagram Account**: Select the account you just created
   - **Target Audience**: e.g., "fitness enthusiasts and gym-goers"
4. Click "Create Campaign"

**What happens automatically:**
- AI generates a personalized message based on your target audience
- 3 demo leads are automatically created:
  - fitness_lover_22
  - healthy_lifestyle
  - workout_daily

### Step 4: View Campaign Details

1. Click "View Details" on your campaign
2. You'll see two tabs:
   - **Leads**: Shows the 3 auto-generated demo leads
   - **Messages**: Currently empty (no messages sent yet)

### Step 5: Activate Campaign (The Magic Happens! 🎉)

1. Click the "Activate" button on your campaign
2. **Automatic actions:**
   - Campaign status changes to "active"
   - AI generates personalized messages for each lead
   - Messages are automatically "sent" to all 3 demo leads
   - All messages are tracked with timestamps

### Step 6: View Sent Messages

1. Go back to Campaign Details
2. Click the "Messages" tab
3. You'll see all 3 personalized messages that were sent!

Each message shows:
- Recipient username
- Personalized message content
- Send status (sent)
- Timestamp
- Demo badge

### Step 7: Check Analytics

1. Navigate to "Dashboard"
2. View your statistics:
   - Total Campaigns
   - Active Campaigns
   - Total Leads
   - Messages Sent

## API Testing with cURL

If you want to test the API directly:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response and use it in subsequent requests:

### Get Campaigns (requires auth)
```bash
curl -X GET http://localhost:5000/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### MongoDB Connection Error

If you see "Failed to connect to MongoDB":
- Ensure MongoDB is running: `mongod`
- Check the `MONGO_URI` in your `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

If port 5000 or 3000 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

### OpenAI API Errors

If you see OpenAI errors:
- The system will automatically use fallback messages
- Messages will still be generated and sent
- Update `OPENAI_API_KEY` in `.env` for AI-generated messages

### Build Errors

If you encounter build errors:
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use a production MongoDB instance
4. Build both projects: `npm run build`
5. Serve the frontend `dist` folder with a static server
6. Run the backend with: `cd backend && npm start`

## Next Steps

- Explore the codebase in `backend/src` and `frontend/src`
- Customize the demo leads in `backend/src/services/campaignService.ts`
- Add more features like custom lead import
- Implement real Instagram Graph API integration (requires Meta approval)

## Support

For issues or questions, please refer to the main README.md or create an issue in the repository.
