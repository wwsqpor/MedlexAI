import ReactMarkdown from "react-markdown"

import styles from "./ChatMessage.module.css";

export default function ChatMessage({ message }) {
  return (
    <div
      className={`
        ${styles.message} 
        ${styles[message.role]}
      `}
    >
      <ReactMarkdown>
        {message.content}
      </ReactMarkdown>
    </div>
  );
}