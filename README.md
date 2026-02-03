# Support Diary App

A private diary application for support team members to process difficult customer interactions and track burnout patterns.

## Features
- Quick mood tracking and journaling
- Pattern recognition for common stressors
- Private, local storage (data never leaves your browser)
- Insights dashboard with trends
- Mobile-responsive design

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Deploy to Netlify

### Method 1: Connect GitHub Repository
1. Push this code to GitHub
2. Go to Netlify.com and click "Add new site"
3. Choose "Import an existing project"
4. Select your GitHub repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

### Method 2: Drag & Drop
1. Run `npm install` and `npm run build` locally
2. Drag the `dist` folder to Netlify's deploy page

## Privacy Note
All diary entries are stored locally in your browser's localStorage. No data is sent to any server. Each user's data is private to their browser/device.
