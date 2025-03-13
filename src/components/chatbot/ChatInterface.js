"use client"

import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon } from "lucide-react"
import ChatMessage from "./ChatMessage"

const ChatInterface = ({ messages, inputValue, setInputValue, handleSendMessage, isLoading }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-24 right-6 w-96 sm:w-[450px] md:w-[500px] h-[600px] bg-white border rounded-lg shadow-xl flex flex-col z-[1000]">
      <div className="p-4 border-b bg-white">
        <h3 className="font-medium text-gray-900">AI Assistant</h3>
        <p className="text-xs text-gray-500">Ask me anything about AI resources</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-gray-500">
              <p className="mb-2">👋 Hi there!</p>
              <p>How can I help you find AI resources today?</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.content} isUser={msg.role === "user"} isStreaming={msg.isStreaming} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 text-gray-900 placeholder:text-gray-400"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface

