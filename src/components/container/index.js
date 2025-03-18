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

   // San Jose State University colors
   const sjsuBlue = "#0055A2"
   const sjsuGold = "#E5A823"

  const handleSearchBtnClick = (e) => {
    console.log("Search string", searchInputRef?.current?.value);
    setQuery(searchInputRef?.current?.value)
    setLoading(true);

    axios
      .get(
        `https://ai-resources-hub-backend.onrender.com/v2-get-resources?q=${searchInputRef?.current?.value}`
      )
      .then((res) => {
        setLoading(false);
        console.log("res", res);
        setSearchResults(res?.data)
        router.push("/resources")
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col">
              <span className="font-bold text-6xl">
                <span style={{ color: sjsuBlue }}>Spartan</span>
                <span style={{ color: sjsuGold }}> AI Hub</span>
              </span>
            </div>
      <div className="w-full max-w-xl mx-auto text-center">
        
        <div className="mb-8">
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
            className="w-full"
          />
          <Button
            loading={loading}
            type="button"
            onClick={handleSearchBtnClick}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
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
