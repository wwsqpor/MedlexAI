import { useSearchParams } from "react-router-dom";


export default function useSelectedCase() {

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCaseId = searchParams.get("caseId") || null;

  const selectCase = (caseId) => {
    setSearchParams((searchParams) => {
      const next = new URLSearchParams(searchParams);
      if (caseId) {
        next.set("caseId", caseId);
      } 
      return next;
    })
  }

  const closeCase = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("caseId");
    setSearchParams(newSearchParams);
  }

  return {
    selectedCaseId,
    selectCase,
    closeCase
  }
}