import { createSelector } from "@reduxjs/toolkit"


export const selectUserCaseSessions = (state) => state.userCases.userCaseSessions;

export const selectStatus = (state) => state.userCases.status;

export const selectError = (state) => state.userCases.error;

export const selectRecentUserCases = createSelector(
  [selectUserCaseSessions],
  (sessions) => {
    return [...sessions]
      .filter((s) => s.started_at)
      .sort(
        (a, b) => 
          new Date(b.started_at) -
          new Date(a.started_at)
      )
      .slice(0, 3);
  }
)