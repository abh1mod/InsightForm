# InsightForm Frontend

A React-based frontend application with authentication system built using Context API and React Router.

## Features

- **Authentication System**: Email/password login and Google OAuth integration
- **Protected Routes**: Dashboard access requires authentication
- **Modern UI**: Built with TailwindCSS for a clean, responsive design
- **Context API**: State management for authentication
- **React Router**: Client-side routing with protected routes

## Project Structure

```
src/
├── components/
│   ├── Login.jsx           # Login page with email/password and Google OAuth
│   ├── Dashboard.jsx       # Protected dashboard page
│   ├── ProtectedRoute.jsx  # Route protection component
│   ├── GoogleCallback.jsx  # Google OAuth callback handler
│   └── Home.jsx           # Root route handler
├── contexts/
│   └── AuthContext.jsx    # Authentication context and state management
└── App.jsx                # Main app with routing setup
```

## Authentication Flow

### Email/Password Login
1. User enters email and password
2. Frontend sends credentials to backend `/api/auth/login`
3. Backend validates and returns JWT token
4. Frontend stores token and updates authentication state
5. User is redirected to dashboard

### Google OAuth Login
1. User clicks "Sign in with Google" button
2. Frontend redirects to backend `/api/auth/google`
3. Backend handles OAuth flow with Google
4. Google redirects back to backend `/api/auth/redirect/google`
5. Backend returns JWT token
6. Frontend stores token and updates authentication state
7. User is redirected to dashboard

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on `http://localhost:3000`

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5000`

## Environment Variables

The frontend expects the backend to be running on `http://localhost:3000`. If you need to change this, update the URLs in:
- `src/contexts/AuthContext.jsx`
- `src/components/GoogleCallback.jsx`

## Backend Integration

This frontend is designed to work with the InsightForm backend which provides:
- JWT-based authentication
- Google OAuth integration
- User management endpoints

## Security Features

- **Protected Routes**: Dashboard and other sensitive pages require authentication
- **Token Storage**: JWT tokens stored in localStorage
- **Automatic Logout**: Invalid tokens automatically log users out
- **Route Protection**: Unauthenticated users are redirected to login

## Styling

The application uses TailwindCSS for styling with:
- Responsive design
- Modern card-based layouts
- Consistent color scheme
- Hover effects and transitions
- Loading states and error handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Ensure the backend server is running on port 3000
2. **Google OAuth Issues**: Check that Google OAuth credentials are properly configured in the backend
3. **Authentication State**: Clear localStorage if experiencing authentication issues

### Development Tips

- Use browser dev tools to monitor network requests
- Check console for authentication errors
- Verify JWT token format in localStorage
- Test both login methods (email/password and Google OAuth)
