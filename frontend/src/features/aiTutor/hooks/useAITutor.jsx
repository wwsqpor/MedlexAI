import { useCallback } from "react"

import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { 
  askAi
} from "../aiTutorThunks"
import {
  selectMessages,
  selectSendMessageStatus,
  selectIsTyping
} from "../aiTutorSelectors"
import { addMessage } from "../aiTutorSlice";

export default function useAITutor() {

  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const sendMessageStatus = useAppSelector(selectSendMessageStatus);
  const isTyping = useAppSelector(selectIsTyping);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    dispatch(addMessage({
      id: crypto.randomUUID(),
      role: "student",
      content: message,
    }))
    await dispatch(askAi(message)).unwrap()
  }, [dispatch])

  return {
    messages,
    sendMessageStatus,
    sendMessage,
    isTyping,
  }


}