
export interface SavedRegex {
  id: string;
  name: string;
  pattern: string;
  description: string;
  example: string;
  createdAt: string;
}

const STORAGE_KEY = 'saved-regex-patterns';

export const getSavedRegexPatterns = (): SavedRegex[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved regex patterns:', error);
    return [];
  }
};

export const saveRegexPattern = (pattern: Omit<SavedRegex, 'id' | 'createdAt'>): SavedRegex => {
  const newPattern: SavedRegex = {
    ...pattern,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  const savedPatterns = getSavedRegexPatterns();
  const updatedPatterns = [...savedPatterns, newPattern];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatterns));
    return newPattern;
  } catch (error) {
    console.error('Error saving regex pattern:', error);
    throw new Error('Failed to save pattern');
  }
};

export const deleteSavedRegexPattern = (id: string): void => {
  const savedPatterns = getSavedRegexPatterns();
  const updatedPatterns = savedPatterns.filter(pattern => pattern.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatterns));
  } catch (error) {
    console.error('Error deleting regex pattern:', error);
    throw new Error('Failed to delete pattern');
  }
};
