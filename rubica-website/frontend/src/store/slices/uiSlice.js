import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  searchModalOpen: false,
  loginModalOpen: false,
  registerModalOpen: false,
  loading: {
    global: false,
    listings: false,
    categories: false,
    cities: false,
  },
  notifications: [],
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
    setSearchModalOpen: (state, action) => {
      state.searchModalOpen = action.payload;
    },
    toggleLoginModal: (state) => {
      state.loginModalOpen = !state.loginModalOpen;
    },
    setLoginModalOpen: (state, action) => {
      state.loginModalOpen = action.payload;
    },
    toggleRegisterModal: (state) => {
      state.registerModalOpen = !state.registerModalOpen;
    },
    setRegisterModalOpen: (state, action) => {
      state.registerModalOpen = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setListingsLoading: (state, action) => {
      state.loading.listings = action.payload;
    },
    setCategoriesLoading: (state, action) => {
      state.loading.categories = action.payload;
    },
    setCitiesLoading: (state, action) => {
      state.loading.cities = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSearchModal,
  setSearchModalOpen,
  toggleLoginModal,
  setLoginModalOpen,
  toggleRegisterModal,
  setRegisterModalOpen,
  setGlobalLoading,
  setListingsLoading,
  setCategoriesLoading,
  setCitiesLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
} = uiSlice.actions;

export const selectUI = (state) => state.ui;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSearchModalOpen = (state) => state.ui.searchModalOpen;
export const selectLoginModalOpen = (state) => state.ui.loginModalOpen;
export const selectRegisterModalOpen = (state) => state.ui.registerModalOpen;
export const selectLoading = (state) => state.ui.loading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;