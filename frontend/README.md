# MediReach - AI-Powered Healthcare Platform

A comprehensive healthcare management system with intelligent AI-powered features designed to enhance patient experience, optimize doctor workflows, and enable data-driven medical insights.

## 🌟 Features

### AI-Powered Capabilities
- **Symptom Checker Chatbot**: Interactive NLP-based chatbot for natural symptom analysis and condition identification
- **Automatic Appointment Triage**: Intelligent prioritization system that ranks patient requests by urgency and routes to appropriate specialists
- **Predictive Health Analytics**: Machine learning-powered insights for health risk assessment, trend analysis, and healthcare demand forecasting

### Patient Portal
- 24/7 AI symptom checking with specialist recommendations
- Easy appointment booking with intelligent scheduling
- Personal health dashboard with appointment history
- Real-time notifications and reminders

### Doctor Dashboard
- Triage-ranked appointment queue with pre-screened symptom summaries
- Patient risk profiles and health history
- AI-generated insights for better decision making
- Appointment management and scheduling tools

### Admin Console
- Predictive analytics dashboard with trend visualization
- Healthcare demand forecasting and resource planning
- Seasonal illness pattern analysis
- System-wide health metrics and KPIs

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express + Node.js with MongoDB (Mongoose) — primary application server and API
- **AI/ML**: OpenAI API integration for NLP and predictive algorithms (invoked from backend routes)
- **Real-time**: Backend-driven realtime via WebSockets or Server-Sent Events (SSE); the app currently uses backend-based notifications
- **Authentication**: Backend JWTs and server-side session management (or third-party providers if integrated)
- **Database**: MongoDB (Mongoose) — primary application database used by the backend

### Key Components

#### AI Services (Edge Functions)
1. **Symptom Checker** (`/functions/v1/symptom-checker`)
   - NLP-based symptom analysis
   - Condition identification and severity scoring
   - Specialist recommendations

2. **Appointment Triage** (`/functions/v1/appointment-triage`)
   - Urgency assessment and prioritization
   - Specialist routing based on symptoms
   - Schedule optimization

3. **Health Analytics** (`/functions/v1/health-analytics`)
   - Patient risk profiling
   - Trend analysis and forecasting
   - Seasonal pattern detection

## 📁 Project Structure

```
project-root/
├── backend/                     # Express + Mongoose backend (primary API & DB access)
│   ├── index.js                 # App bootstrap (connects to MongoDB)
│   ├── package.json             # Server dependencies & scripts
│   ├── middleware/              # Auth and other middlewares
│   ├── models/                  # Mongoose schemas (User, DoctorProfile, Appointment, ...)
│   ├── routes/                  # Express route handlers (auth, doctors, appointments, notifications)
│   └── tests/                   # Server unit/integration tests
├── frontend/                    # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/          # UI components (admin, auth, doctor, patient, etc.)
│   │   ├── contexts/            # React contexts (Auth, Theme)
│   │   ├── lib/
│   │   │   └── api.ts           # API client for backend
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
├── README.md                    # Project-level README (this file)
└── package-lock.json
```

Note on realtime & auth
- Realtime notifications and authentication are handled by the backend and the API (see `backend/` for implementation details). If you plan to add a third-party client SDK later, document it in this README.

### For Administrators
1. **Analytics Dashboard**: Monitor system-wide health metrics
2. **Forecasting**: View demand predictions and resource allocation recommendations
3. **Trend Analysis**: Identify seasonal patterns and emerging health concerns
4. **System Management**: Manage users, roles, and platform settings

## 🔒 Security & Privacy

### Data Protection
- **End-to-End Security**: All data encrypted in transit and at rest
- **Row Level Security (RLS)**: Database-level access control ensuring users only see their own data
- **JWT Authentication**: Secure token-based authentication system

### Compliance
- **HIPAA Compliance**: Healthcare data handling follows HIPAA guidelines
- **GDPR Compliance**: User privacy and data protection measures in place
- **Audit Trail**: Complete logging of AI interactions and data access
- **User Consent**: Explicit opt-in required for AI data usage

### Privacy Features
- Data anonymization for analytics
- Patient consent tracking for all AI features
- Clear disclaimers: AI insights are supplementary to professional medical advice
- Configurable data retention policies

## 🧪 Testing

Run linting and type checking:
```bash
npm run lint
npm run typecheck
```

## 📁 Project Structure

```
frontend/src/
├── components/                  # UI components (admin, auth, doctor, patient, etc.)
├── contexts/                    # React contexts (Auth, Theme)
├── lib/                         # API client and helpers (api.ts)
├── App.tsx
└── main.tsx
```

Updated (current workspace):

```
project/
├── server/                      # Express + Mongoose backend
│   ├── index.js                 # App bootstrap
│   ├── package.json             # Server dependencies & scripts
│   ├── middleware/              # Auth and other middlewares
│   ├── models/                  # Mongoose schemas (User, DoctorProfile, Appointment, ...)
│   ├── routes/                  # Express route handlers (auth, doctors, appointments, notifications)
│   └── tests/                   # Server unit/integration tests
├── src/                         # Frontend (React + TypeScript + Vite)
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── doctor/
│   │   ├── layout/
│   │   ├── notifications/
│   │   └── patient/
│   ├── contexts/                # React contexts (Auth, Theme)
│   ├── lib/                     # API client and helpers (api.ts)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── test/                        # Frontend test setup
├── index.html                   # Frontend entry HTML
├── package.json                 # Frontend dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json / tsconfig.app.json
├── tailwind.config.js
└── README.md

```

## 🤝 API Endpoints

### AI Symptom Checker
```
POST /functions/v1/symptom-checker
Content-Type: application/json

{
  "symptoms": "sore throat and fever",
  "duration": "2 days"
}

Response:
{
  "analysis": {
    "conditions": ["Viral Infection", "Flu", "Tonsillitis"],
    "severity": 6.5,
    "recommendations": ["See General Practitioner", "Rest", "Hydration"]
  }
}
```

### Appointment Triage
```
POST /functions/v1/appointment-triage
Content-Type: application/json

{
  "symptoms": "chest pain",
  "patientId": "user-uuid"
}

Response:
{
  "urgency": "emergency",
  "priority_score": 95,
  "recommended_specialist": "Cardiologist",
  "estimated_wait_time": "15 minutes"
}
```

### Health Analytics
```
GET /functions/v1/health-analytics?period=month

Response:
{
  "trends": [...],
  "forecast": {...},
  "risk_profiles": [...]
}
```

## 📊 AI Model Performance

The AI system continuously improves with real-world data:
- **Symptom Recognition**: Trained on medical databases and user feedback
- **Triage Accuracy**: Validated against established medical severity scales
- **Prediction Models**: Ensemble methods combining multiple ML algorithms

## 🔄 Real-Time Features

- Live appointment status updates
- Real-time notification delivery
- Instant chatbot responses
- Dynamic schedule synchronization

## 📈 Analytics & Insights

### Patient-Level Analytics
- Health risk scores and trends
- Appointment frequency and patterns
- Treatment effectiveness tracking

### System-Level Analytics
- Disease prevalence and seasonal trends
- Healthcare resource utilization
- Demand forecasting by specialty
- System performance metrics

## 🚨 Troubleshooting

### Common Issues

**Chatbot not responding**
- Check browser console for errors
- Ensure JavaScript is enabled

**Appointment triage not working**
- Confirm symptoms are entered completely
- Check network connectivity
- Verify doctor availability in system

**Analytics dashboard empty**
- Requires sufficient historical data
- Check date range filter settings
- Verify admin access permissions

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation in code comments
3. Check browser console for error messages
4. Contact system administrator

## 📝 License

This project is proprietary and confidential.

## 🙏 Acknowledgments

- Built with React and modern web technologies
- AI capabilities powered by OpenAI API
- UI components styled with Tailwind CSS
- Icons from Lucide React

---

**Note**: This healthcare platform is designed to assist medical professionals and patients. AI recommendations are supplementary and should not replace professional medical advice. Always consult with qualified healthcare providers for diagnosis and treatment.
