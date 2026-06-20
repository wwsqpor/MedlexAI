import { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../../app/hooks/index.jsx";

import {
  selectCases,
  selectCategories,
  selectCasesStatus,
  selectCategoriesStatus,
  selectCaseDetailsStatus,
  selectError,

} from "../casesSelectors.js";

import { fetchCases, fetchCategories } from "../casesThunks"


export default function useCasesLibrary() {

  const dispatch = useAppDispatch();

  const cases = useAppSelector(selectCases);
  const categories = useAppSelector(selectCategories);
  const casesStatus = useAppSelector(selectCasesStatus);
  const categoriesStatus = useAppSelector(selectCategoriesStatus);
  const caseDetailsStatus = useAppSelector(selectCaseDetailsStatus);
  const error = useAppSelector(selectError);

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
    if (casesStatus === "idle") {
      dispatch(fetchCases());
    }
  }, [])

  return {
    cases,
    categories,
    casesStatus,
    categoriesStatus,
    caseDetailsStatus,
    error
  }
}