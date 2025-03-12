"use client"
import { Button } from "@/components/ui/button"
import { MessageCircleIcon, XIcon } from "lucide-react"

const ChatButton = ({ isOpen, toggleChat }) => {
  return (
    <Button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 z-[1000]"
    >
      {isOpen ? <XIcon className="h-6 w-6" /> : <MessageCircleIcon className="h-6 w-6" />}
      <span className="sr-only">{isOpen ? "Close chat" : "Open chat"}</span>
    </Button>
  )
}

export default ChatButton

