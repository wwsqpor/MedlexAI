import AITutorHeader from "../AITutorHeader/AITutorHeader"
import ChatMessages from "../ChatMessages/ChatMessages"
import ChatInput from "../ChatInput/ChatInput"
import Box from "../../../../components/Box/Box"

import styles from "./AITutorLayout.module.css"


export default function AITutorLayout() {


  return (
    <div className={styles["ai-tutor-layout"]}>
      <AITutorHeader />
      <Box className={styles["chat-window"]}>
        <ChatMessages />
        <ChatInput />
      </Box>
    </div>
  )
}