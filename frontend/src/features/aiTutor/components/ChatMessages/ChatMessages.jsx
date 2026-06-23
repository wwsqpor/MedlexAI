import { useAITutor } from "../../hooks"

import ChatMessage from "../ChatMessage/ChatMessage";

import styles from "./ChatMessages.module.css";

export default function ChatMessages() {
  const { messages, isTyping } = useAITutor();

  return (
    <div className={styles.messages}>
      {messages.length === 0 && 
        <h4 className={styles.title}>Начните диалог с AI-тьютором</h4>
      }
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}
      {isTyping && (
        <div className={styles.typing}>
          AI тьютор думает...
        </div>
      )}
    </div>

  );
}