import { useAppSelector } from "../../../app/hooks";

import {
  selectCases,
  selectIsLoading,
  selectError
} from "../casesSelectors.js";


export default function useCases() {

  const cases = useAppSelector(selectCases);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    cases,
    isLoading,
    error
  }
}