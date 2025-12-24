import type { CreateTaskFormData } from "@/schemas/create-task-schema";
import { useAuth } from "@/store/auth.store";

export async function updateTask(payload: CreateTaskFormData) {
  const { accessToken } = useAuth.getState();

  const res: Response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  }).then(async (v) => await v.json());

  return res; 
}
