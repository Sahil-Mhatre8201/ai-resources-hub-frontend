import "@/styles/globals.css";
import { SearchProvider } from "@/context/SearchContext";
import Chatbot from "@/components/chatbot/Chatbot";

export default function App({ Component, pageProps }) {
  return (
    <SearchProvider>
      <Component {...pageProps} />
      <Chatbot apiEndpoint="http://127.0.0.1:8000/chat" />
    </SearchProvider>
  );
}
