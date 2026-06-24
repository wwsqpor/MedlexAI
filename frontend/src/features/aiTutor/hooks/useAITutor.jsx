import { useCallback } from "react"

import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { 
  askAi,
  fetchChatHistory
} from "../aiTutorThunks"
import {
  selectMessages,
  selectMessagesStatus,
  selectSendMessageStatus,
  selectIsTyping
} from "../aiTutorSelectors"
import { addMessage } from "../aiTutorSlice";

export default function useAITutor() {

  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const messagesStatus = useAppSelector(selectMessagesStatus);
  const sendMessageStatus = useAppSelector(selectSendMessageStatus);
  const isTyping = useAppSelector(selectIsTyping);
  
  const loadHistory = useCallback(async () => {
    await dispatch(fetchChatHistory());
  }, [dispatch])

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    dispatch(addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      created_at: new Date().toISOString()
    }))
    await dispatch(askAi(message)).unwrap()
    // await dispatch(fetchChatHistory()).unwrap()
  }, [dispatch])

  return {
    messages,
    messagesStatus,
    sendMessageStatus,
    loadHistory,
    sendMessage,
    isTyping,
  }


}