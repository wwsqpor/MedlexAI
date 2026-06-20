export const selectDashboard = (state) => state.dashboard;

export const selectStats = (state) =>
  state.dashboard.stats;

export const selectCompletedCases = (state) =>
  state.dashboard.stats.completed_cases;

export const selectCompletedThisWeek = (state) =>
  state.dashboard.stats.completed_this_week;

export const selectAverageScore = (state) =>
  state.dashboard.stats.average_score;

export const selectScoreChange = (state) =>
  state.dashboard.stats.score_change;

export const selectLastCase = (state) =>
  state.dashboard.stats.last_case;

export const selectBestResult = (state) =>
  state.dashboard.stats.best_result;

export const selectContinueCase = (state) =>
  state.dashboard.continue_case;

export const selectProgress = (state) =>
  state.dashboard.progress;

export const selectLegalRating = (state) =>
  state.dashboard.progress.legal_rating;

export const selectStrongTopics = (state) =>
  state.dashboard.strong_topics;

export const selectWeakTopics = (state) =>
  state.dashboard.weak_topics;

export const selectStatus = (state) => 
  state.dashboard.status;

export const selectError = (state) => {
  state.dashboard.error;
  ;
}