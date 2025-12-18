import type { CreateTaskFormData } from "@/schemas/create-task-schema";

export async function register(payload: CreateTaskFormData) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then(async (v) => await v.json());

  return res;
}
