import useSWR from "swr";

import { Fetcher } from "@/lib/utils";

const useFetchData = (url: string) => {
  const { data, isLoading, error } = useSWR(url, Fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true
  });
  return {
    data,
    isLoading,
    error
  };
};

export default useFetchData;
