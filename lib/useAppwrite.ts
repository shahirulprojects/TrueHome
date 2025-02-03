// this file is a custom hook that handles appwrite api calls with built-in loading, error, and data states
// we can pass in a function and optional parameters and it will handle the api call, loading, error, and data states

import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

// generic interface for the hook options where:
// T: represents the expected return type from the appwrite function
// P: represents an object of parameters that the function accepts (must be string or number)
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>; // the async function to be executed (typically an appwrite api call)
  params?: P; // optional parameters to pass to the function
  skip?: boolean; // flag to control whether the function should execute on mount
}

// defines the structure of what the hook returns where:
// T: the type of data returned from the api
// P: the parameter type needed for refetching
interface UseAppwriteReturn<T, P> {
  data: T | null; // holds the data returned from the api call
  loading: boolean; // indicates if the api call is in progress
  error: string | null; // stores any error messages that occur during the api call
  refetch: (newParams: P) => Promise<void>; // function to manually trigger a new api call with new parameters
}

// custom hook to handle appwrite api calls with built-in loading, error, and data states
// T: type of data returned from the api
// P: type of parameters the api function accepts
export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null); // tracks the response data from the api
  const [loading, setLoading] = useState(!skip); // tracks loading state (initially true unless skip is enabled)
  const [error, setError] = useState<string | null>(null); // tracks any error messages

  // memoized function to handle the api call
  const fetchData = useCallback(
    async (fetchParams: P) => {
      // reset states before making the api call
      setLoading(true);
      setError(null);

      try {
        // execute the api call and store the result
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        // handle errors and show alert to user
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        // always mark loading as complete
        setLoading(false);
      }
    },
    [fn]
  );

  // automatically execute the api call on mount unless skip is true
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  // exposed function to manually trigger a new api call
  const refetch = async (newParams: P) => await fetchData(newParams);

  return { data, loading, error, refetch };
};
