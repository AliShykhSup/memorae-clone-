# AutoIGDM Pro - Instagram DM Automation Platform

A full-stack demonstration platform for automated Instagram DM campaigns with AI-powered message generation.

## ✨ Features

### ✅ Working Features:

- **User Authentication**: JWT-based authentication system
- **Instagram Account Management**: Demo mode for managing Instagram accounts (username-based)
- **AI Message Generation**: Powered by OpenAI GPT-4o for personalized message creation
- **Campaign Creation**: Create campaigns with targeting and AI-generated messages
- **Auto-Lead Generation**: Automatically generates 3 demo leads when a campaign is created
  - `fitness_lover_22` - Fitness Lover
  - `healthy_lifestyle` - Healthy Lifestyle
  - `workout_daily` - Workout Daily
- **Auto-Message Sending**: Automatically sends personalized DMs when a campaign is activated
- **Campaign Details Page**: View leads and sent messages in organized tabs
- **Analytics Dashboard**: Track campaigns, leads, and message statistics
- **Campaign Status Management**: Draft, Active, Paused, and Completed states

### 🔄 Complete Workflow:

1. **Register/Login** to your account
2. **Add Instagram Account** (demo mode - username-based)
3. **Create Campaign** with target audience
   - AI automatically generates a personalized message
   - 3 demo leads are automatically created
4. **Activate Campaign** 
   - System sends personalized DMs to all demo leads
   - Messages are tracked in the Messages tab
5. **View Campaign Details**
   - See all leads in the Leads tab
   - View sent messages in the Messages tab

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- OpenAI API key (optional - system works with fallback messages)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AliShykhSup/memorae-clone-.git
   cd memorae-clone-
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/autoigdm
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   OPENAI_API_KEY=your-openai-api-key-here
   NODE_ENV=development
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

4. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
memorae-clone-/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   ├── services/        # Business logic (AI, Campaign)
│   │   └── server.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (Auth)
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Instagram Accounts
- `GET /api/instagram` - Get all Instagram accounts
- `POST /api/instagram` - Add Instagram account
- `DELETE /api/instagram/:id` - Delete Instagram account

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get single campaign
- `POST /api/campaigns` - Create campaign (auto-generates leads)
- `POST /api/campaigns/:id/activate` - Activate campaign (sends messages)
- `POST /api/campaigns/:id/pause` - Pause campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `GET /api/campaigns/:id/leads` - Get campaign leads
- `GET /api/campaigns/:id/messages` - Get campaign messages

### Analytics
- `GET /api/analytics` - Get user analytics

## ⚠️ Important Notes

### This is a DEMONSTRATION System

**To send REAL Instagram DMs in production, you need:**

1. **Instagram Business Account** verified with Meta
2. **Facebook App** with Instagram Graph API access
3. **OAuth Authentication** (not just username/password)
4. **API Permissions**: 
   - `instagram_basic`
   - `instagram_manage_messages`
   - `pages_messaging`
5. **Meta App Review** approval

The current system **simulates** the automation workflow with demo leads and messages. Real Instagram DM sending requires:
- Official Instagram Graph API integration
- Compliance with Meta's messaging policies
- OAuth token-based authentication
- Webhook configuration for real-time updates

### Production Security Considerations

⚠️ **Before deploying to production, you MUST:**

1. **Implement Rate Limiting**: Install and configure `express-rate-limit` to prevent abuse
2. **Enable HTTPS**: Use SSL/TLS certificates for all traffic
3. **Add Security Headers**: Install and configure `helmet` middleware
4. **Set Strong JWT Secret**: Use a cryptographically secure random secret
5. **Configure MongoDB Authentication**: Enable authentication and use secure credentials

See [SECURITY.md](SECURITY.md) for detailed security recommendations and implementation guide.

## 🛠️ Technologies Used

### Backend
- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- OpenAI GPT-4o
- bcryptjs for password hashing

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Vite for build tooling
- CSS3 for styling

## 📊 Demo Features

When you **activate a campaign**, the system automatically:

1. ✅ Retrieves the 3 auto-generated demo leads
2. ✅ Uses AI to create personalized messages for each lead
3. ✅ Simulates sending DMs to each lead
4. ✅ Tracks all messages with timestamps
5. ✅ Updates campaign status to "active"

All demo data is clearly marked in the UI with "Demo" badges.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Input validation
- CORS configuration
- Environment variable management

## 📝 License

ISC

## 👥 Author

Ali Rizwan

## 🤝 Contributing

This is a demonstration project. For production use, implement proper Instagram Graph API integration.
