// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for fallacy examples
let fallacyExamples = [];
let lastUpdateTime = null;

// Natural Language Processing helper (simplified)
const analyzeFallacyType = (text) => {
  // In a real implementation, you might use a more sophisticated NLP approach
  // or a pre-trained model to detect fallacy types
  const keywords = {
    AD_HOMINEM: ['attack', 'person', 'character', 'insulting', 'credentials'],
    STRAW_MAN: ['misrepresent', 'distort', 'exaggerate', 'position', 'claim'],
    FALSE_DICHOTOMY: ['either', 'or', 'only two', 'black and white', 'false choice'],
    APPEAL_TO_AUTHORITY: ['expert', 'authority', 'scientist', 'professor', 'doctor'],
    SLIPPERY_SLOPE: ['lead to', 'eventually', 'next thing', 'if we allow', 'snowball']
  };

  const textLower = text.toLowerCase();
  const scores = {};
  
  Object.keys(keywords).forEach(fallacy => {
    scores[fallacy] = keywords[fallacy].reduce((score, keyword) => {
      return score + (textLower.includes(keyword) ? 1 : 0);
    }, 0);
  });
  
  // Find the fallacy with the highest score
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
};

// Sources to check for fallacies
const SOURCES = [
  { 
    name: 'Reddit Debate Forums',
    url: 'https://www.reddit.com/r/changemyview/hot.json',
    parser: async (url) => {
      try {
        const response = await axios.get(url, {
          headers: { 'User-Agent': 'Fallacy-Trainer/1.0' }
        });
        
        const posts = response.data.data.children;
        return posts.map(post => ({
          text: post.data.title,
          source: `Reddit: r/changemyview`,
          url: `https://www.reddit.com${post.data.permalink}`
        })).slice(0, 5); // Take top 5
      } catch (error) {
        console.error('Error fetching from Reddit:', error);
        return [];
      }
    }
  },
  {
    name: 'Twitter Political Discussions',
    url: 'https://api.twitter.com/2/tweets/search/recent?query=politics%20OR%20debate',
    parser: async (url) => {
      // Note: Twitter API requires authentication
      // This is a placeholder - you would need to implement OAuth
      return [];
    }
  },
  {
    name: 'News Comment Sections',
    url: 'https://example-news-api.com/comments/top',
    parser: async (url) => {
      // Placeholder for a news comment API
      return [];
    }
  }
];

// Function to fetch and process new examples
const updateFallacyExamples = async () => {
  console.log('Updating fallacy examples...');
  
  try {
    const newExamples = [];
    
    for (const source of SOURCES) {
      try {
        const sourceData = await source.parser(source.url);
        
        for (const item of sourceData) {
          const fallacyType = analyzeFallacyType(item.text);
          
          newExamples.push({
            text: item.text,
            source: item.source,
            url: item.url,
            fallacyType,
            explanation: `This appears to be a ${fallacyType.toLowerCase().replace('_', ' ')} fallacy based on the content and context.`
          });
        }
      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error);
      }
    }
    
    // If we found new examples, update our store
    if (newExamples.length > 0) {
      fallacyExamples = [...newExamples, ...fallacyExamples].slice(0, 50);
      lastUpdateTime = new Date();
      console.log(`Updated with ${newExamples.length} new examples`);
    } else {
      console.log('No new examples found');
    }
  } catch (error) {
    console.error('Error updating fallacy examples:', error);
  }
};

// Fallback examples in case API sources fail
const FALLBACK_EXAMPLES = [
  {
    text: "Don't listen to Dr. Smith's climate research. He drives an SUV, so he's a hypocrite.",
    source: "Twitter discussion on climate policy",
    fallacyType: "AD_HOMINEM",
    explanation: "This attacks Dr. Smith personally rather than addressing his research."
  },
  {
    text: "If we allow same-sex marriage, next people will want to marry their pets!",
    source: "Political debate on marriage equality",
    fallacyType: "SLIPPERY_SLOPE",
    explanation: "This suggests an extreme outcome without evidence of the connection."
  },
  {
    text: "Scientists say we should trust the vaccine, but scientists have been wrong before.",
    source: "Health forum discussion",
    fallacyType: "APPEAL_TO_AUTHORITY",
    explanation: "This misuses appeals to authority by suggesting that being wrong once invalidates expertise."
  },
  {
    text: "My opponent wants to regulate businesses, which means they want full government control of the economy.",
    source: "Economic policy debate",
    fallacyType: "STRAW_MAN",
    explanation: "This misrepresents the position to make it easier to attack."
  },
  {
    text: "Either we cut taxes or the economy will collapse.",
    source: "Budget discussion",
    fallacyType: "FALSE_DICHOTOMY",
    explanation: "This presents only two options when many others exist."
  }
];

// Initialize with fallback examples
fallacyExamples = [...FALLBACK_EXAMPLES];
lastUpdateTime = new Date();

// Schedule hourly updates
cron.schedule('0 * * * *', updateFallacyExamples);

// API Endpoints
app.get('/api/fallacy-examples', (req, res) => {
  res.json(fallacyExamples);
});

app.get('/api/status', (req, res) => {
  res.json({
    exampleCount: fallacyExamples.length,
    lastUpdateTime,
    nextUpdateTime: new Date(lastUpdateTime.getTime() + 60 * 60 * 1000)
  });
});

// Start server on initial load
updateFallacyExamples().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Fallacy Trainer API running on port ${PORT}`);
  });
});
