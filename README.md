# fallacyFighter
Fallacy Fighter
# Fallacy Trainer: A Duolingo-Style Logical Fallacy Trainer

This project creates an interactive, embeddable training tool that helps users identify and understand logical fallacies using real-world examples sourced from the internet. The system refreshes its example database hourly to keep content fresh and relevant.

## System Components

1. **React Frontend**: A Duolingo-inspired UI that presents fallacy examples and quizzes users
2. **Backend API**: Node.js server that fetches, analyzes, and serves fallacy examples
3. **HTML Embed**: Code snippet to embed the trainer on any website

## Setup Instructions

### 1. Backend API Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fallacy-trainer.git
   cd fallacy-trainer/api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with the following:
   ```
   PORT=3000
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   ```

4. Start the server:
   ```
   npm start
   ```

The API server will run on `http://localhost:3000` by default.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the API URL:
   Edit `src/config.js` to point to your API server:
   ```javascript
   export const API_URL = 'http://localhost:3000';
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Build for production:
   ```
   npm run build
   ```

### 3. Deployment

#### Option A: Deploy to Vercel (Recommended)

1. Create a Vercel account if you don't have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Deploy the backend:
   ```
   cd ../api
   vercel
   ```
4. Deploy the frontend:
   ```
   cd ../frontend
   vercel
   ```
5. Connect your domains and configure environment variables in the Vercel dashboard

#### Option B: Self-hosting

1. Set up a Node.js server for the backend
2. Deploy the frontend build to a static hosting service
3. Configure CORS and environment variables

### 4. Embedding on Websites

Use the following HTML snippet to embed the Fallacy Trainer on any website:

```html
<div id="fallacy-trainer"></div>
<script src="https://your-frontend-url.com/embed.js"></script>
<script>
  FallacyTrainer.init({
    apiUrl: 'https://your-api-url.com',
    theme: 'light'
  });
</script>
```

## Customization Options

### Adding New Fallacy Types

Edit the `FALLACY_TYPES` object in both the frontend and backend code to add new fallacy types:

```javascript
const FALLACY_TYPES = {
  NEW_FALLACY_TYPE: {
    name: 'New Fallacy Name',
    description: 'Description of the new fallacy type',
  },
  // ... existing fallacy types
};
```

### Configuring Data Sources

Edit the `SOURCES` array in `server.js` to add or modify data sources:

```javascript
const SOURCES = [
  {
    name: 'New Source Name',
    url: 'https://api.newsource.com/endpoint',
    parser: async (url) => {
      // Parser implementation
    }
  },
  // ... existing sources
];
```

## Maintenance and Updates

The system automatically refreshes its fallacy database hourly. To manually trigger an update:

1. Make a GET request to `/api/refresh` (requires authentication in production)
2. Or use the FallacyTrainer JavaScript API: `FallacyTrainer.refresh()`

## Troubleshooting

- **API Connection Issues**: Check CORS settings and ensure the API URL is correctly configured
- **Empty Examples**: Verify API keys for data sources and check server logs
- **Embed Not Loading**: Make sure the embed script URL is correct and accessible

## License

This project is licensed under the MIT License - see the LICENSE file for details.
