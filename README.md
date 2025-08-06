# Kredible - Automated Candidate Due Diligence

Kredible automates the candidate verification process by collecting and displaying key social-proof stats from GitHub, Stack Overflow, and LinkedIn in one comprehensive profile.

## 🚀 Features

- **Recruiter Sign-Up System**: Secure form with Google OAuth integration
- **Automated Candidate Emails**: Generate unique verification links and send professional emails
- **Social Proof Aggregation**: Collect data from GitHub, LinkedIn, and Stack Overflow
- **Real-time Dashboard**: Track verification requests and view completed profiles
- **Mobile-Responsive**: Works seamlessly on all devices
- **Privacy-First**: Secure token-based system with data encryption

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **Backend**: Next.js API Routes
- **Authentication**: Google OAuth
- **Email**: SendGrid/AWS SES/Resend (configurable)
- **Database**: PostgreSQL/MongoDB/SQLite (configurable)

## 📦 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kredible.git
cd kredible

# Install dependencies
npm install
# or
pnpm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# At minimum, set these variables:
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Secret to `.env.local`

### 4. Email Service Setup

Choose one email provider and configure in `.env.local`:

#### SendGrid (Recommended)
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
```

#### AWS SES
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

#### Resend
```bash
RESEND_API_KEY=your_resend_api_key
```

### 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ System Architecture

### 1. Recruiter Flow
```
1. Recruiter visits /recruiter-signup
2. Fills out form with their info + candidate details
3. System generates unique token and stores request
4. Automated email sent to candidate with verification link
5. Recruiter sees "Request Sent" confirmation
```

### 2. Candidate Flow
```
1. Candidate receives email with unique link
2. Clicks link → /candidate-form/[token]
3. System validates token and shows request details
4. Candidate provides GitHub/LinkedIn/SO profiles
5. System fetches social proof data
6. Recruiter gets notified with compiled profile
```

### 3. Data Processing
```
1. GitHub API → Repository count, followers, languages
2. LinkedIn → Headline, connections, position
3. Stack Overflow API → Reputation, questions, answers
4. Compile into comprehensive profile card
```

## 📁 Project Structure

```
kredible/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx              # Root layout
│   ├── recruiter-signup/       # Recruiter sign-up form
│   ├── candidate-form/[token]/ # Candidate verification form
│   ├── dashboard/              # Recruiter dashboard
│   └── api/                    # API routes
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── navbar.tsx             # Navigation component
│   └── ...                    # Feature-specific components
├── lib/
│   ├── api.ts                 # Client-side API utilities
│   ├── auth.ts                # Authentication configuration
│   └── utils.ts               # Utility functions
└── public/
    └── images/                # Static assets
```

## 🔧 Configuration Options

### Database Setup

The application supports multiple database options:

#### PostgreSQL (Recommended for Production)
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/kredible
```

#### MongoDB
```bash
MONGODB_URI=mongodb://localhost:27017/kredible
```

#### SQLite (Development Only)
```bash
DATABASE_URL=file:./dev.db
```

### Security Configuration

```bash
# JWT Secret for token signing
NEXTAUTH_SECRET=your_random_secret_key

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# Restrict recruiter email domains (optional)
ALLOWED_EMAIL_DOMAINS=company1.com,company2.com
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
# Build image
docker build -t kredible .

# Run container
docker run -p 3000:3000 --env-file .env.local kredible
```

### Environment Variables for Production

```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
# ... other production configs
```

## 🔌 API Integration

### External APIs Used

1. **GitHub API**
   - Repository count and activity
   - Follower/following stats
   - Top programming languages

2. **LinkedIn API** (requires partnership)
   - Professional headline
   - Connection count
   - Current position

3. **Stack Overflow API**
   - Reputation score
   - Question/answer ratio
   - Top tags

### Adding New Social Platforms

To add support for new platforms:

1. Create API integration in `lib/social-apis/`
2. Add form fields in candidate form
3. Update profile generation logic
4. Add UI components for displaying data

## 🔒 Security Features

- **Secure Tokens**: Unique, time-limited verification tokens
- **Data Encryption**: All sensitive data encrypted at rest
- **Rate Limiting**: Prevents abuse and spam
- **Input Validation**: Comprehensive validation on all forms
- **CORS Protection**: Configured for production security
- **OAuth Integration**: Secure Google authentication

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Analytics & Monitoring

### Key Metrics to Track

- Verification request completion rate
- Average time to complete verification
- Most popular social platforms
- Recruiter engagement metrics

### Recommended Tools

- **Analytics**: Google Analytics, Posthog
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **Uptime**: UptimeRobot

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Create GitHub issue for bugs or feature requests
- **Email**: support@kredible.com

## 🗺️ Roadmap

- [ ] LinkedIn API integration (requires partnership)
- [ ] Advanced analytics dashboard
- [ ] Bulk candidate invitations
- [ ] Custom branding for enterprises
- [ ] API for third-party integrations
- [ ] Mobile app for candidates

---

Built with ❤️ by the Kredible Team
