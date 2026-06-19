import { useSearchParams } from "react-router-dom"


export default function useCasesFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const order = searchParams.get("order") || "newest";
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";
  
  const setFilter = (key, value) => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      return next;
    })
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return {
    search,
    order,
    category,
    difficulty,
    setFilter,
    clearFilters
  } 
}