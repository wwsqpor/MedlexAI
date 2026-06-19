import { useAppSelector } from "../../../app/hooks";

import {
  selectCases,
  selectCategories,
  selectIsLoading,
  selectError,

} from "../casesSelectors.js";


export default function useCases() {

  const cases = useAppSelector(selectCases);
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    cases,
    categories,
    isLoading,
    error
  }
}