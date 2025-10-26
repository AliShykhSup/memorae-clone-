# Architecture Documentation - AutoIGDM Pro

## System Overview

AutoIGDM Pro is a full-stack TypeScript application that demonstrates Instagram DM automation with AI-powered message generation. The system is built with a clear separation between the backend API and frontend UI.

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **AI Integration**: OpenAI GPT-4o API
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3

## Architecture Patterns

### Backend Architecture

```
backend/
├── src/
│   ├── config/          # Configuration and environment variables
│   ├── middleware/      # Express middleware (authentication)
│   ├── models/          # MongoDB/Mongoose models
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic layer
│   └── server.ts        # Application entry point
```

#### Layered Architecture:

1. **Routes Layer**: HTTP request handling and validation
2. **Service Layer**: Business logic and orchestration
3. **Model Layer**: Data access and MongoDB schema
4. **Middleware Layer**: Cross-cutting concerns (auth, logging)

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page-level components
│   ├── context/         # React Context (Auth state)
│   ├── services/        # API client services
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application component
```

#### Component Architecture:

1. **Pages**: Route-level components (Dashboard, Campaigns, etc.)
2. **Components**: Reusable UI components (Navbar)
3. **Context**: Global state management (Authentication)
4. **Services**: API communication layer

## Data Models

### User Model
```typescript
{
  email: string (unique)
  password: string (hashed)
  name: string
  createdAt: Date
}
```

### Instagram Account Model
```typescript
{
  userId: ObjectId (ref: User)
  username: string
  displayName: string
  isActive: boolean
  createdAt: Date
}
```

### Campaign Model
```typescript
{
  userId: ObjectId (ref: User)
  instagramAccountId: ObjectId (ref: InstagramAccount)
  name: string
  targetAudience: string
  message: string (AI-generated)
  status: 'draft' | 'active' | 'paused' | 'completed'
  createdAt: Date
  activatedAt: Date (optional)
}
```

### Lead Model
```typescript
{
  campaignId: ObjectId (ref: Campaign)
  username: string
  displayName: string
  isDemo: boolean
  createdAt: Date
}
```

### Message Model
```typescript
{
  campaignId: ObjectId (ref: Campaign)
  leadId: ObjectId (ref: Lead)
  content: string
  status: 'sent' | 'failed' | 'pending'
  sentAt: Date
  isDemo: boolean
}
```

## Key Workflows

### 1. User Authentication Flow

```
Client                   Backend                  Database
  |                        |                         |
  |-- POST /auth/register--|                         |
  |                        |-- Create User --------->|
  |                        |<-- User Created --------|
  |                        |-- Generate JWT ---------|
  |<-- Token + User Data --|                         |
  |                        |                         |
  |-- Store Token ---------|                         |
  |   (localStorage)       |                         |
```

### 2. Campaign Creation Flow

```
Client                   Backend                  AI Service
  |                        |                         |
  |-- POST /campaigns ---->|                         |
  |                        |-- Generate Message ---->|
  |                        |<-- AI Message ----------|
  |                        |-- Create Campaign ----->|
  |                        |-- Generate Demo Leads ->|
  |<-- Campaign + Leads ---|                         |
```

**Auto-generated Demo Leads:**
1. fitness_lover_22 (Fitness Lover)
2. healthy_lifestyle (Healthy Lifestyle)
3. workout_daily (Workout Daily)

### 3. Campaign Activation Flow (Core Feature)

```
Client                   Backend                  AI Service
  |                        |                         |
  |-- POST /campaigns/:id/activate ----------------->|
  |                        |                         |
  |                        |-- Update Status to Active
  |                        |                         |
  |                        |-- Get Campaign Leads ---|
  |                        |                         |
  |                        |-- For Each Lead:        |
  |                        |   |-- Generate Message->|
  |                        |   |<-- Personalized ----|
  |                        |   |-- Create Message -->|
  |                        |                         |
  |<-- Updated Campaign ---|                         |
```

### 4. View Messages Flow

```
Client                   Backend                  Database
  |                        |                         |
  |-- GET /campaigns/:id/messages ------------------>|
  |                        |                         |
  |                        |-- Query Messages ------>|
  |                        |<-- Messages with Leads -|
  |                        |                         |
  |<-- Messages List ------|                         |
  |                        |                         |
  |-- Display in UI -------|                         |
```

## Security Features

### Authentication
- **JWT Tokens**: Stateless authentication
- **Token Expiry**: 7 days
- **Password Hashing**: bcrypt with 10 salt rounds
- **Protected Routes**: Middleware checks for valid JWT

### API Security
- **CORS**: Configured for cross-origin requests
- **Input Validation**: express-validator on all inputs
- **Authorization**: User can only access their own data
- **Environment Variables**: Sensitive data in .env

### Best Practices
- No passwords in responses
- SQL injection prevention (MongoDB queries)
- XSS prevention (React auto-escaping)
- HTTPS recommended for production

## AI Integration

### OpenAI Service

**Purpose**: Generate personalized Instagram DM messages

**API Used**: OpenAI GPT-4o

**Message Generation Process**:
1. Receive target audience from campaign
2. Send prompt to OpenAI with context
3. Get AI-generated message (< 150 characters)
4. Use fallback message if API fails

**Fallback Strategy**:
- If no API key: Use template message
- If API error: Use template message
- Template format: "Hi {name}! I noticed you're interested in {audience}..."

### Personalization

**Campaign Message**: Generic message for the campaign
```
Input: "fitness enthusiasts"
Output: "Hi! Love your fitness journey! Would love to connect and share tips."
```

**Lead Messages**: Personalized for each lead
```
Input: "fitness enthusiasts", "Fitness Lover"
Output: "Hi Fitness Lover! Your dedication to fitness is inspiring! Let's connect!"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user

### Instagram Accounts
- `GET /api/instagram` - List user's accounts
- `POST /api/instagram` - Add new account
- `DELETE /api/instagram/:id` - Remove account

### Campaigns
- `GET /api/campaigns` - List user's campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign (auto-generates leads)
- `POST /api/campaigns/:id/activate` - Activate and send messages
- `POST /api/campaigns/:id/pause` - Pause campaign
- `DELETE /api/campaigns/:id` - Delete campaign and data
- `GET /api/campaigns/:id/leads` - Get campaign leads
- `GET /api/campaigns/:id/messages` - Get sent messages

### Analytics
- `GET /api/analytics` - Get user statistics

## Frontend Routing

```
/ (root)                    → Redirect to /dashboard
/login                      → Login page (public)
/register                   → Register page (public)
/dashboard                  → Analytics dashboard (protected)
/instagram                  → Instagram accounts (protected)
/campaigns                  → Campaign list (protected)
/campaigns/:id              → Campaign details (protected)
```

**Route Guards**:
- Public routes: Redirect to dashboard if authenticated
- Protected routes: Redirect to login if not authenticated

## State Management

### Authentication State
- Managed by React Context (`AuthContext`)
- Stored in localStorage for persistence
- Synced across components

### Component State
- Local state with `useState` for UI state
- Effects with `useEffect` for data fetching
- No global state needed (simple app)

## Database Schema Design

### Relationships

```
User 1---* InstagramAccount
User 1---* Campaign
Campaign *---1 InstagramAccount
Campaign 1---* Lead
Campaign 1---* Message
Lead 1---* Message
```

### Indexes
- User.email (unique)
- Campaign.userId
- Lead.campaignId
- Message.campaignId

## Deployment Considerations

### Development
- Backend: `npm run dev` (ts-node-dev with hot reload)
- Frontend: `npm run dev` (Vite dev server)
- Database: Local MongoDB

### Production
- Backend: Build with `tsc`, run with `node`
- Frontend: Build with `vite build`, serve static files
- Database: MongoDB Atlas or managed instance
- Environment: Set `NODE_ENV=production`

### Environment Variables
- Development: `.env` file
- Production: Platform-specific (Heroku, Vercel, etc.)

## Limitations (Demo Mode)

### Current Implementation
- ✅ Demo leads auto-generated
- ✅ Messages simulated and tracked
- ✅ No actual Instagram connection
- ✅ Username-based account management

### Production Requirements
- Instagram Business Account
- Facebook App with Graph API access
- OAuth 2.0 authentication flow
- API permissions and Meta approval
- Webhook configuration
- Rate limiting and quotas
- Real-time message tracking

## Future Enhancements

1. **Real Instagram Integration**
   - OAuth flow for Instagram
   - Graph API message sending
   - Webhook handlers

2. **Advanced Features**
   - Custom lead import (CSV)
   - Message templates
   - A/B testing
   - Scheduling
   - Analytics export

3. **Scalability**
   - Background job processing
   - Message queue (Redis/RabbitMQ)
   - Caching layer
   - Load balancing

4. **Additional Integrations**
   - Multiple social platforms
   - CRM integration
   - Email notifications
   - Slack/Discord webhooks

## Performance Considerations

### Backend
- MongoDB indexes for fast queries
- Pagination support (in API structure)
- Async/await for non-blocking operations
- Connection pooling (Mongoose default)

### Frontend
- Code splitting (Vite automatic)
- Lazy loading for routes
- Optimized builds with minification
- Asset optimization

### Database
- Compound indexes for common queries
- Aggregation pipelines for analytics
- Lean queries when full documents not needed

## Testing Strategy

### Backend Testing
- Unit tests: Service layer functions
- Integration tests: API endpoints
- E2E tests: Full workflows

### Frontend Testing
- Component tests: React Testing Library
- Integration tests: User flows
- E2E tests: Playwright/Cypress

### Manual Testing Checklist
1. User registration and login
2. Add Instagram account
3. Create campaign (verify leads generated)
4. Activate campaign (verify messages sent)
5. View leads and messages
6. Check analytics
7. Pause/delete campaigns

## Monitoring and Logging

### Recommended for Production
- Application logs: Winston or Bunyan
- Error tracking: Sentry
- Performance monitoring: New Relic or DataDog
- Uptime monitoring: Pingdom or UptimeRobot

### Logging Points
- Authentication attempts
- API errors
- Campaign activations
- Message sending
- Database operations

---

This architecture supports the demo requirements while being extensible for future real Instagram integration.