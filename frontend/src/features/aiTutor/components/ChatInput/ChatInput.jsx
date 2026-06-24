import { useState } from "react";

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";

import { useAITutor } from "../../hooks/";

import styles from "./ChatInput.module.css";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  const { sendMessage } = useAITutor();

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setMessage("");
    await sendMessage(message);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSubmit(message);
    }
  }

  return (
    <div className={styles.input}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        onKeyDown={handleKeyDown}
      />

      {/* <Button
        onClick={handleSubmit}
        disabled={isTyping}
      >
        Отправить
      </Button> */}
    </div>
  );
}