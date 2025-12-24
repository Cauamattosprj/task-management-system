import { useAuth } from "@/store/auth.store";
import type { TaskDTO } from "@/types/task.dto";

interface GetTasksResponse {
  data: TaskDTO[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export async function getTasks(
  page: number,
  pageSize = 20
): Promise<GetTasksResponse> {
  const { accessToken, refresh } = useAuth.getState();

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/tasks?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (res.status === 401) {
    await refresh();

    const newToken = useAuth.getState().accessToken;

    const retry = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/tasks?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      }
    );

    if (!retry.ok) {
      throw new Error("Unauthorized");
    }

    return retry.json();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const response: GetTasksResponse = await res.json();
  return response;
}
