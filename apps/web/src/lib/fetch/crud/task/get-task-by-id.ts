import { useAuth } from "@/store/auth.store";
import type { TaskDTO } from "@/types/task.dto";

export async function getTaskById(id: string): Promise<TaskDTO> {
  const { accessToken, refresh } = useAuth.getState();

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/tasks/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

  const response: TaskDTO = await res.json();
  return response;
}
