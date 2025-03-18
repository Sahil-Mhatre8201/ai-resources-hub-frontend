"use client"

import { useState, useEffect } from "react"
import ChatButton from "./ChatButton"
import ChatInterface from "./ChatInterface"

const Chatbot = ({ apiEndpoint = "https://ai-resources-hub-backend.onrender.com/chat" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // Set loading state
    setIsLoading(true)

    // Create a placeholder for the assistant's response
    setMessages((prev) => [...prev, { role: "assistant", content: "", isStreaming: true }])

    try {
      // Create the EventSource for SSE
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedResponse = ""

      while (true) {
        const { value, done } = await reader.read()

        if (done) break

        // Decode the chunk
        const chunk = decoder.decode(value)

        // Process each line in the chunk
        const lines = chunk.split("\n\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.substring(6) // Remove 'data: ' prefix

            if (content === "[DONE]") {
              // Stream is complete
              break
            } else if (content.startsWith("Error:")) {
              // Handle error
              throw new Error(content)
            } else {
              // Add the content to the accumulated response
              accumulatedResponse += content

              // Update the message in real-time
              setMessages((prev) =>
                prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, content: accumulatedResponse } : msg)),
              )
            }
          }
        }
      }

      // When streaming is complete, update the final message
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, content: accumulatedResponse, isStreaming: false } : msg,
        ),
      )
    } catch (error) {
      console.error("Error sending message:", error)
      // Update the error message
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again later.",
                isStreaming: false,
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      <ChatButton isOpen={isOpen} toggleChat={toggleChat} />
      {isOpen && (
        <ChatInterface
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default Chatbot

