import "@/styles/globals.css";
import { SearchProvider } from "@/context/SearchContext";

export default function App({ Component, pageProps }) {
  return (
    <SearchProvider>
      <Component {...pageProps} />
    </SearchProvider>
  );
}
