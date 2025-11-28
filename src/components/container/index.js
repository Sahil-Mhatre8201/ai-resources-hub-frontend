import { useRouter } from "next/router";
import Image from "next/image";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

const HomeContainer = () => {
  const [loading, setLoading] = useState(false);
  const { setSearchResults, setQuery } = useSearch();
  const router = useRouter()


  const searchInputRef = useRef(null);

   // San Jose State University brand colors
   const sjsuBlue = "#0055A2"
   const sjsuGold = "#E5A823"

  // This function is called when the search button is clicked
  // It handles fetching resources from the backend API based on the user's search input
  const handleSearchBtnClick = (e) => {
    // Get the search string from the input field
    console.log("Search string", searchInputRef?.current?.value);
    setQuery(searchInputRef?.current?.value)
    setLoading(true); // Set loading state to true while fetching

    // Make a GET request to the backend API with the search query
    axios
      .get(
        `https://ai-resources-hub-backend.onrender.com/v2-get-resources?q=${searchInputRef?.current?.value}`
      )
      .then((res) => {
        setLoading(false); // Set loading state to false after response
        console.log("res", res);
        // Update the search results in context with the data from the API response
        setSearchResults(res?.data)
        // Navigate to the resources page to display the results
        router.push("/resources")
      })
      .catch((err) => {
        // Handle any errors that occur during the API call
        console.log("Error", err);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-3 sm:px-4 py-8 sm:py-16 md:py-24">
      <div className="flex flex-col items-center w-full">
              <span className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">
                <span style={{ color: sjsuBlue }}>Spartan</span>
                <span style={{ color: sjsuGold }}> AI Hub</span>
              </span>
            </div>
      <div className="w-full max-w-xl mx-auto text-center mt-6 sm:mt-8 md:mt-10">
        
        <div className="mb-6 sm:mb-8">
          {/* <Image
            src="/logo.svg"
            alt="Logo"
            width={150}
            height={50}
            className="mx-auto"
          /> */}
           {/* <div className="flex flex-col">
              <span className="font-bold text-xl">
                <span style={{ color: sjsuBlue }}>Spartan</span>
                <span style={{ color: sjsuGold }}> AI Hub</span>
              </span>
            </div> */}
        </div>
        <Form className="space-y-4">
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search..."
            name="q"
            className="w-full text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3"
          />
          <Button
            loading={loading}
            type="button"
            onClick={handleSearchBtnClick}
            className="w-full text-sm sm:text-base py-2 sm:py-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Fetching Results...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </Form>
      </div>
    </main>
  );
};

export default HomeContainer;
