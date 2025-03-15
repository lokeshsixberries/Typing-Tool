// Common words for typing practice
export const wordLists = {
  beginner: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'
  ],
  intermediate: [
    'computer', 'program', 'keyboard', 'monitor', 'software', 'developer',
    'language', 'practice', 'learning', 'improve', 'typing', 'speed', 
    'accuracy', 'progress', 'challenge', 'success', 'achieve', 'goal'
  ],
  experienced: [
    'implementation', 'sophisticated', 'development', 'professional',
    'extraordinary', 'accomplishment', 'determination', 'perseverance',
    'revolutionary', 'technological', 'infrastructure', 'collaboration'
  ]
};

export const specialCharacters = {
  punctuation: ['.', ',', ';', ':', '!', '?', '-', '"', "'"],
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  special: ['@', '#', '$', '%', '&', '*', '(', ')', '+', '=']
};

export const levelConfigs: Record<DifficultyLevel, LevelConfig> = {
  beginner: {
    name: 'beginner',
    wordCount: 20,
    timeLimit: 60,
    description: 'Perfect for those just starting out. Simple, common words to build confidence.'
  },
  intermediate: {
    name: 'intermediate',
    wordCount: 30,
    timeLimit: 60,
    description: 'Challenge yourself with longer words and increased complexity.'
  },
  experienced: {
    name: 'experienced',
    wordCount: 40,
    timeLimit: 60,
    description: 'Advanced level with seasoned typists and complex words.'
  }
};