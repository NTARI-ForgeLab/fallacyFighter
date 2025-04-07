import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, AlertCircle } from 'lucide-react';

// Define fallacy types
const FALLACY_TYPES = {
  AD_HOMINEM: {
    name: 'Ad Hominem',
    description: 'Attacking the person instead of addressing their argument',
  },
  STRAW_MAN: {
    name: 'Straw Man',
    description: 'Misrepresenting an argument to make it easier to attack',
  },
  FALSE_DICHOTOMY: {
    name: 'False Dichotomy',
    description: 'Presenting only two options when others exist',
  },
  APPEAL_TO_AUTHORITY: {
    name: 'Appeal to Authority',
    description: 'Using an authority figure as evidence without addressing the argument',
  },
  SLIPPERY_SLOPE: {
    name: 'Slippery Slope',
    description: 'Asserting that a small step will lead to extreme consequences',
  },
};

const FallacyTrainer = () => {
  const [currentExample, setCurrentExample] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [examples, setExamples] = useState([]);

  // Mock function to fetch examples from API
  // In production, this would be replaced with a real API call
  const fetchExamples = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call to your backend
      // that fetches fresh examples from the internet
      const response = await fetch('/api/fallacy-examples');
      const data = await response.json();
      setExamples(data);
    } catch (error) {
      // If API fails, use some default examples
      setExamples([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamples();
    
    // Set up hourly refresh
    const refreshInterval = setInterval(() => {
      fetchExamples();
    }, 3600000); // 1 hour
    
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (examples.length > 0) {
      getNextExample();
    }
  }, [examples]);

  const getNextExample = () => {
    // Reset state
    setSelectedOption(null);
    setFeedback(null);
    
    // Get a random example
    const randomIndex = Math.floor(Math.random() * examples.length);
    const example = examples[randomIndex];
    setCurrentExample(example);
    
    // Create options (including the correct one)
    const fallacyTypes = Object.keys(FALLACY_TYPES);
    const correctType = example.fallacyType;
    
    // Get 3 other random fallacy types
    const otherTypes = fallacyTypes
      .filter(type => type !== correctType)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle
    const allOptions = [correctType, ...otherTypes].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    const isCorrect = option === currentExample.fallacyType;
    
    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: `Correct! This is an example of ${FALLACY_TYPES[option].name}.`,
        explanation: currentExample.explanation
      });
      setScore(score + 10);
      setStreak(streak + 1);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Incorrect. This is an example of ${FALLACY_TYPES[currentExample.fallacyType].name}, not ${FALLACY_TYPES[option].name}.`,
        explanation: currentExample.explanation
      });
      setStreak(0);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading fallacy examples...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Fallacy Trainer</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Award size={14} />
              <span>{score}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Heart size={14} color={streak > 0 ? "red" : "gray"} />
              <span>{streak}</span>
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Identify the logical fallacy in this example:
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentExample && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-lg">"{currentExample.text}"</p>
              <p className="text-sm text-gray-500 mt-2">Source: {currentExample.source}</p>
            </div>
            
            <div className="space-y-2">
              {options.map((option) => (
                <Button
                  key={option}
                  variant={
                    selectedOption === option
                      ? feedback && feedback.isCorrect
                        ? "success"
                        : "destructive"
                      : feedback && option === currentExample.fallacyType
                      ? "success"
                      : "outline"
                  }
                  className="w-full justify-start text-left py-4 h-auto"
                  onClick={() => !selectedOption && handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                >
                  <div>
                    <div className="font-medium">{FALLACY_TYPES[option].name}</div>
                    <div className="text-sm opacity-80">{FALLACY_TYPES[option].description}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            {feedback && (
              <div className={`p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className={feedback.isCorrect ? 'text-green-500' : 'text-red-500'} />
                  <div>
                    <p className="font-medium">{feedback.message}</p>
                    <p className="mt-1">{feedback.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={getNextExample}
          disabled={!selectedOption}
        >
          Next Example
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FallacyTrainer;
