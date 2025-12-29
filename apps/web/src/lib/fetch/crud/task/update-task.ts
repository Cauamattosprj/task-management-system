import type { CreateTaskFormData } from "@/schemas/create-task-schema";
import { useAuth } from "@/store/auth.store";

export async function updateTask(taskId: string, payload: CreateTaskFormData) {
  const { accessToken } = useAuth.getState();

  console.log("payload", payload);

  const res: Response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/tasks/${taskId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  ).then(async (v) => await v.json());

  console.log(res);
  return res;
}
