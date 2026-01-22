export async function refresh() {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    },
  ).then(async (v) => await v.json());

  return res;
}
