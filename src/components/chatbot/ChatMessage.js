import ReactMarkdown from "react-markdown"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ChatMessage = ({ message, isUser, isStreaming }) => {
  // Pre-process the message to fix numbered lists
  const processMessage = (text) => {
    if (!text) return ""

    // More comprehensive fix for numbered lists
    // First, split by numbers followed by periods (e.g., "1.", "2.")
    const parts = text.split(/(\d+\.\s)/)

    if (parts.length <= 1) return text // No numbered lists found

    let result = parts[0] // Start with any text before the first number

    // Process each numbered item
    for (let i = 1; i < parts.length; i += 2) {
      if (i + 1 < parts.length) {
        // This is a number (e.g., "1. ") followed by content
        const number = parts[i]
        const content = parts[i + 1]

        // Add proper markdown formatting
        if (i === 1 && !result.endsWith("\n\n")) {
          // First item needs a line break if there's text before it
          result += result.length > 0 ? "\n\n" + number + content : number + content
        } else {
          // Subsequent items always need a line break
          result += "\n\n" + number + content
        }
      } else {
        // Just a number with no content after it
        result += parts[i]
      }
    }

    return result
  }

  const processedMessage = isUser ? message : processMessage(message)

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${isUser ? "bg-primary text-white" : "bg-gray-100 text-gray-900"}`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        ) : (
          <div className="text-sm markdown-content">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
                ),
                p: ({ node, ...props }) => <p {...props} className="mb-2" />,
                h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold my-2" />,
                h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold my-2" />,
                h3: ({ node, ...props }) => <h3 {...props} className="text-md font-bold my-2" />,
                ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 my-2" />,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 my-2" />,
                li: ({ node, ...props }) => <li {...props} className="mb-1" />,
                strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                em: ({ node, ...props }) => <em {...props} className="italic" />,
                code: ({ node, ...props }) => <code {...props} className="bg-gray-200 px-1 rounded" />,
                pre: ({ node, ...props }) => (
                  <pre {...props} className="bg-gray-200 p-2 rounded my-2 overflow-x-auto" />
                ),
              }}
            >
              {processedMessage}
            </ReactMarkdown>
            {isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-gray-400 animate-pulse"></span>}
          </div>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export default ChatMessage

