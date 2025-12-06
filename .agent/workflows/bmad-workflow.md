---
description: BMAD workflow for MERN Authentication project completion and deployment
---

# BMAD Workflow: MERN Authentication Project

## B - Build/Fix Backend Issues

### 1. Fix Server Configuration Issues
- Fix duplicate imports and middleware order in `server/server.js`
- Ensure all required dependencies are installed (`helmet` and `express-rate-limit`)
- Verify MongoDB connection configuration
- Check environment variables setup in `server/.env`

// turbo
### 2. Install Missing Backend Dependencies
```bash
cd server
pnpm install
```

### 3. Test Backend APIs
// turbo
```bash
cd server
pnpm run server
```
- Verify server starts without errors
- Test health endpoint: `http://localhost:5000/api/health`
- Test authentication endpoints

## M - Make Frontend Complete

### 4. Check Frontend Dependencies
// turbo
```bash
cd client
pnpm install
```

### 5. Configure Environment Variables
- Verify `client/.env` has correct backend API URL
- Ensure `VITE_BACKEND_URL` is set properly

### 6. Test Frontend Development Build
// turbo
```bash
cd client
pnpm run dev
```
- Verify app runs on `http://localhost:5173`
- Test login/signup flow
- Test email verification
- Test password reset

### 7. Fix Any UI/UX Issues
- Check responsive design
- Verify toast notifications work
- Ensure all forms validate properly

## A - Audit & Test Integration

### 8. Integration Testing
- Test full authentication flow (signup → email verify → login)
- Test password reset flow
- Test protected routes
- Verify JWT token handling
- Check cookie-based authentication

### 9. Security Audit
- Verify rate limiting is working
- Check CORS configuration
- Ensure passwords are hashed
- Validate JWT implementation
- Check for XSS vulnerabilities

### 10. Code Quality Check
- Run ESLint on frontend
// turbo
```bash
cd client
pnpm run lint
```
- Check for console errors
- Verify error handling

## D - Deploy to Production

### 11. Prepare for Production

#### Backend Deployment (Render/Railway/Heroku)
- Create production MongoDB Atlas database
- Set up environment variables on hosting platform
- Configure production build settings

#### Frontend Deployment (Vercel/Netlify)
- Build production frontend
// turbo
```bash
cd client
pnpm run build
```
- Configure environment variables
- Set up deployment from Git repository

### 12. Deploy Backend
**Recommended Platform: Render.com (Free Tier)**

Steps:
1. Push code to GitHub repository
2. Create new Web Service on Render
3. Connect to GitHub repository
4. Set build command: `cd server && pnpm install`
5. Set start command: `cd server && pnpm start`
6. Add environment variables from `server/.env`
7. Deploy

### 13. Deploy Frontend
**Recommended Platform: Vercel (Free Tier)**

Steps:
1. Install Vercel CLI or use web interface
2. Connect to GitHub repository
3. Set root directory to `client`
4. Set build command: `pnpm run build`
5. Set output directory: `dist`
6. Add environment variables (VITE_BACKEND_URL pointing to backend)
7. Deploy

### 14. Post-Deployment Testing
- Test all authentication flows on production
- Verify email notifications work
- Check mobile responsiveness
- Test cross-browser compatibility
- Monitor error logs

### 15. Documentation
- Update README.md with:
  - Project description
  - Features list
  - Installation instructions
  - Environment variables setup
  - Deployment instructions
  - API documentation
  - Screenshots

## Additional Recommendations

### Performance Optimization
- Enable compression
- Optimize images
- Implement caching strategies
- Use CDN for static assets

### Monitoring & Analytics
- Set up error tracking (Sentry)
- Add analytics (Google Analytics)
- Monitor API performance
- Set up uptime monitoring

### Future Enhancements
- Add OAuth (Google, GitHub)
- Implement 2FA
- Add user profile management
- Email templates customization
- Admin dashboard
