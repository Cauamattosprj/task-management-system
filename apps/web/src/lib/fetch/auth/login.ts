import type { CreateTaskFormData } from "@/schemas/create-task-schema";

export async function login(payload: CreateTaskFormData) {
  console.log("recebido: ", payload);
  console.log("recebido após stringify: ", JSON.stringify(payload));

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/login`,
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
