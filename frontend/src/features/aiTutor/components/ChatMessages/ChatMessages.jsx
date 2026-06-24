import { useEffect, useRef } from "react";

import { useAITutor } from "../../hooks"

import ChatMessage from "../ChatMessage/ChatMessage";
import Loader from "../../../../components/Loader/Loader"

import styles from "./ChatMessages.module.css";

export default function ChatMessages() {
  const { messages, messagesStatus, isTyping, loadHistory } = useAITutor();
  const bottomRef = useRef(null);

  useEffect(() => {
    loadHistory()
  }, [loadHistory])
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages])

  if (messagesStatus === "loading") {
    return <Loader />
  }

  return (
    <div className={styles.messages}>
      {messages.length === 0 && 
        <h4 className={styles.title}>Начните диалог с AI-тьютором</h4>
      }
      {messages.map((message) => (
        <ChatMessage
          key={String(message.created_at)}
          message={message}
        />
      ))}
      {isTyping && (
        <div className={styles.typing}>
          AI тьютор думает...
        </div>
      )}
      <div ref={bottomRef}/>
    </div>

  );
}