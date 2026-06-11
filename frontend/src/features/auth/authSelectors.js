const selectAuth = (state) => state.auth;

const selectUser = (state) => state.auth.user;

const selectAccessToken = (state) => state.auth.accessToken;

const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

const selectIsInitialized = (state) => state.auth.isInitialized;

const selectIsLoading = (state) => state.auth.isLoading;

const selectError = (state) => state.auth.error;


export {
  selectAuth,
  selectUser,
  selectAccessToken,
  selectIsAuthenticated,
  selectIsInitialized,
  selectIsLoading,
  selectError
}