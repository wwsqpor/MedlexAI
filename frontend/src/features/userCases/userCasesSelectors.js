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

export const selectCurrentSession = (state) => state.userCases.currentSession;

export const selectCurrentSessionStatus = (state) => state.userCases.currentSessionStatus;

export const selectSubmitAnswerStatus = (state) => state.userCases.submitAnswerStatus;

export const selectTaskAnswer = (state, taskId) => state.userCases.currentSession.answers.find(
  a => a.task === taskId
)

export const selectUserAnswers = (state) => state.userCases.userAnswers;

export const selectResult = (state) => state.userCases.result;

export const selectResultStatus = (state) => state.userCases.resultStatus;