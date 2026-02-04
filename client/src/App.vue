<template>
  <div class="hd-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed, 'mobile': isMobile }">
    <!-- Mobile Header -->
    <header v-if="isMobile" class="hd-mobile-header">
      <el-icon class="menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
        <Menu />
      </el-icon>
      <span class="header-title">Hexo Dashboard</span>
      <div class="header-actions">
        <el-icon @click="toggleTheme">
          <Sunny v-if="currentTheme === 'dark'" />
          <Moon v-else />
        </el-icon>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div v-if="isMobile && mobileMenuOpen" class="hd-mobile-overlay" @click="mobileMenuOpen = false"></div>

    <!-- Sidebar -->
    <aside class="hd-sidebar" :class="{ 'open': mobileMenuOpen }">
      <div class="sidebar-header">
        <span v-if="!sidebarCollapsed" class="logo">Hexo Dashboard</span>
        <el-icon v-if="!isMobile" class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <Fold v-if="!sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
        <el-icon v-else class="close-btn" @click="mobileMenuOpen = false">
          <Close />
        </el-icon>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          @click="mobileMenuOpen = false"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-if="!sidebarCollapsed || isMobile" class="nav-text">{{ t(item.label) }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <!-- Language Selector -->
        <div class="settings-item" v-if="!sidebarCollapsed || isMobile">
          <el-select
            v-model="selectedLanguage"
            @change="onLanguageChange"
            class="lang-select"
          >
            <el-option
              v-for="lang in languages"
              :key="lang.code"
              :label="lang.nativeName"
              :value="lang.code"
            />
          </el-select>
        </div>

        <!-- Theme Toggle -->
        <div v-if="!isMobile" class="settings-item theme-toggle" @click="toggleTheme">
          <el-icon>
            <Sunny v-if="currentTheme === 'dark'" />
            <Moon v-else />
          </el-icon>
          <span v-if="!sidebarCollapsed">
            {{ currentTheme === 'dark' ? t('settings.lightMode') : t('settings.darkMode') }}
          </span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="hd-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Login Dialog -->
    <el-dialog
      v-model="showLoginDialog"
      :title="t('auth.login')"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form @submit.prevent="handleLogin">
        <el-form-item :label="t('auth.username')">
          <el-input v-model="loginForm.username" autocomplete="username" />
        </el-form-item>
        <el-form-item :label="t('auth.password')">
          <el-input v-model="loginForm.password" type="password" autocomplete="current-password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loginLoading" style="width: 100%">
            {{ t('auth.login') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  Document,
  Files,
  Setting,
  PriceTag,
  Menu,
  Fold,
  Expand,
  Sunny,
  Moon,
  Close,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useI18n, type Language } from '@/i18n';
import { useTheme } from '@/composables/useTheme';
import { unauthorized } from '@/request';
import authApi from '@/api/auth';

const route = useRoute();
const { t, currentLanguage, setLanguage, languages } = useI18n();
const { currentTheme, toggleTheme } = useTheme();

const sidebarCollapsed = ref(false);
const mobileMenuOpen = ref(false);
const isMobile = ref(false);
const showLoginDialog = ref(false);
const loginLoading = ref(false);

const loginForm = ref({
  username: '',
  password: '',
});

const selectedLanguage = ref<Language>(currentLanguage.value);

const navItems = [
  { path: '/posts', label: 'nav.posts', icon: Document },
  { path: '/pages', label: 'nav.pages', icon: Files },
  { path: '/main-config', label: 'nav.mainConfig', icon: Setting },
  { path: '/theme-config', label: 'nav.themeConfig', icon: PriceTag },
];

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const onLanguageChange = (lang: Language) => {
  setLanguage(lang);
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    mobileMenuOpen.value = false;
  }
};

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    return;
  }

  loginLoading.value = true;
  try {
    await authApi.authenticate(loginForm.value.username, loginForm.value.password);
    showLoginDialog.value = false;
    unauthorized.value = false;
    loginForm.value = { username: '', password: '' };
    ElMessage.success(t('auth.loginSuccess'));
  } catch {
    ElMessage.error(t('auth.loginError'));
  } finally {
    loginLoading.value = false;
  }
};

watch(unauthorized, (val) => {
  showLoginDialog.value = val;
});

watch(currentLanguage, (val) => {
  selectedLanguage.value = val;
});

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.hd-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.hd-sidebar {
  width: 240px;
  height: 100%;
  background-color: var(--hd-bg-secondary);
  border-right: 1px solid var(--hd-border);
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar-collapsed .hd-sidebar {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--hd-border);
  min-width: 240px;
}

.sidebar-collapsed .sidebar-header {
  min-width: 64px;
  justify-content: center;
}

.logo {
  font-size: 16px;
  font-weight: 700;
  color: var(--hd-text);
  margin: 0;
  user-select: none;
  white-space: nowrap;
}

.collapse-btn,
.close-btn {
  cursor: pointer;
  font-size: 18px;
  color: var(--hd-text-tertiary);
  transition: color 0.2s;
}

.collapse-btn:hover,
.close-btn:hover {
  color: var(--hd-text);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 240px;
}

.sidebar-collapsed .sidebar-nav {
  min-width: 64px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  color: var(--hd-text-secondary);
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  margin-bottom: 4px;
  white-space: nowrap;
}

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 12px;
}

.nav-item:hover {
  background-color: var(--hd-bg-tertiary);
  color: var(--hd-text);
}

.nav-item.active {
  background-color: var(--hd-bg-tertiary);
  color: var(--hd-text);
  font-weight: 500;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--hd-border);
  min-width: 240px;
}

.sidebar-collapsed .sidebar-footer {
  min-width: 64px;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--hd-text-secondary);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.sidebar-collapsed .settings-item {
  justify-content: center;
  padding: 12px;
}

.settings-item:hover {
  background-color: var(--hd-bg-tertiary);
  color: var(--hd-text);
}

.lang-select {
  width: 100%;
}

.lang-select :deep(.el-input__wrapper) {
  background-color: var(--hd-bg-tertiary) !important;
}

/* Main Content */
.hd-main {
  flex: 1;
  overflow-y: auto;
  background-color: var(--hd-bg);
}

/* Mobile Styles */
.hd-mobile-header {
  display: none;
}

.hd-mobile-overlay {
  display: none;
}

.mobile .hd-mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--hd-bg-secondary);
  border-bottom: 1px solid var(--hd-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.mobile .hd-mobile-header .menu-toggle,
.mobile .hd-mobile-header .header-actions .el-icon {
  font-size: 20px;
  cursor: pointer;
  color: var(--hd-text);
}

.mobile .header-title {
  font-size: 16px;
  font-weight: 600;
  user-select: none;
  color: var(--hd-text);
}

.mobile .hd-layout {
  flex-direction: column;
  padding-top: 52px;
}

.mobile .hd-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  width: 280px;
  transform: translateX(-100%);
}

.mobile .hd-sidebar.open {
  transform: translateX(0);
}

.mobile .hd-mobile-overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
}

.mobile .hd-main {
  height: calc(100vh - 52px);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
