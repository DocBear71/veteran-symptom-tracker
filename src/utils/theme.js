// Theme storage key
const THEME_KEY = 'symptomTracker_theme';

// Get saved theme preference, default to 'light'
export const getSavedTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;

    // Check system preference as fallback
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

// Save theme preference
export const saveTheme = (theme) => {
    localStorage.setItem(THEME_KEY, theme);
};

// Apply theme to document
export const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};