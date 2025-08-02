"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

const Search = () => {
  const [query, setQuery] = React.useState<string | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (query?.trim()) {
      params.set("name", query.trim());
    } else {
      params.delete("name");
    }

    router.push(`?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("name");
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex overflow-hidden gap-x-2 border border-[#4F46E5] rounded-md px-4 py-1 items-center w-full md:w-[50%]"
    >
      <SearchIcon color="#4F46E5" className="shrink-0" />
      <div className="flex items-center gap-x-2 w-full">
        <Input
          placeholder="Search by name"
          className="flex-1 border-none !ring-0 !outline-none focus:!outline-none focus:!ring-0 focus:!border-none focus:!shadow-none"
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

export default Search;
