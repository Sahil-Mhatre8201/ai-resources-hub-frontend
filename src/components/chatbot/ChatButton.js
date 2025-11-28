"use client"
import { Button } from "@/components/ui/button"
import { MessageCircleIcon, XIcon } from "lucide-react"

const ChatButton = ({ isOpen, toggleChat }) => {
  return (
    <Button
      onClick={toggleChat}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 z-[1000]"
    >
      {isOpen ? <XIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
      <span className="sr-only">{isOpen ? "Close chat" : "Open chat"}</span>
    </Button>
  )
}

export default ChatButton

