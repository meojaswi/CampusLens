import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

const MAX_COMPARE = 3;

export function AppProvider({ children }) {
  const [compareList, setCompareList] = useLocalStorage('campuslens_compare', []);
  const [savedColleges, setSavedColleges] = useLocalStorage('campuslens_saved', []);

  const addToCompare = (college) => {
    setCompareList((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      if (prev.some((c) => c.id === college.id)) return prev;
      return [...prev, college];
    });
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) => prev.filter((c) => c.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isComparing = (id) => {
    return compareList.some((c) => c.id === id);
  };

  const toggleSave = (college) => {
    setSavedColleges((prev) => {
      if (prev.some((c) => c.id === college.id)) {
        return prev.filter((c) => c.id !== college.id);
      }
      return [...prev, college];
    });
  };

  const isSaved = (id) => {
    return savedColleges.some((c) => c.id === id);
  };

  const value = {
    compareList,
    savedColleges,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isComparing,
    isSaved,
    toggleSave,
    maxCompare: MAX_COMPARE,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
