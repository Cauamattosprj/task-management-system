import type { TaskDTO } from "@/types/task.dto";
import { getTasks } from "@/lib/fetch/crud/task/get-tasks";

interface FetchAllTasksResult {
  tasks: TaskDTO[];
  total: number;
  totalPages: number;
  lastPageFetched: number;
}

export async function fetchAllTasks(): Promise<FetchAllTasksResult> {
  let currentPage = 1;
  let accumulatedTasks: TaskDTO[] = [];
  let total = 0;
  let totalPages = 0;

  while (true) {
    const res = await getTasks(currentPage);

    accumulatedTasks.push(...res.data);
    total = res.total;
    totalPages = res.totalPages;

    if (accumulatedTasks.length >= total) {
      break;
    }

    currentPage++;
  }

  return {
    tasks: accumulatedTasks,
    total,
    totalPages,
    lastPageFetched: currentPage,
  };
}
