import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

const Search = () => {
  return (
    <div className="flex overflow-hidden gap-x-2 border-[1px] border-[#4F46E5] rounded-md px-4 py-1 items-center w-full md:w-[50%]">
      <SearchIcon color="#4F46E5" />
      <Input
        placeholder="Search by name"
        className="flex-1 border-none !ring-0 !outline-none focus:!outline-none focus:!ring-0 focus:!border-none focus:!shadow-none"
      />
    </div>
  );
};

export default Search;
