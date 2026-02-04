import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'hexo-dashboard-theme';

function getDefaultTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const currentTheme = ref<Theme>(getDefaultTheme());

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Apply initial theme
applyTheme(currentTheme.value);

watch(currentTheme, (newTheme) => {
  applyTheme(newTheme);
  localStorage.setItem(STORAGE_KEY, newTheme);
});

export function setTheme(theme: Theme) {
  currentTheme.value = theme;
}

export function toggleTheme() {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
}

export function useTheme() {
  return {
    currentTheme,
    setTheme,
    toggleTheme,
  };
}
