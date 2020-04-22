import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, mutate } = useSWR("/api/user", fetcher);
  const user = data && data.user;
  return [user, { mutate }];
}

export function useLoans() {
  const { data, error } = useSWR("/api/loan", fetcher);
  if (error) return [{ message: "Failed to retreive." }];
  const loans = data;
  return [loans];
}

export function useLoanToGetById(url) {
  const { data, error } = useSWR(url, fetcher);
  if (error) return [{ message: "Failed to retreive." }];
  const loans = data;
  return [loans];
}
