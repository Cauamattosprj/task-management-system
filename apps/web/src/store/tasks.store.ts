import { fetchAllTasks } from "@/lib/fetch/crud/task/get-all-tasks";
import type { TaskDTO } from "@/types/task.dto";
import { create } from "zustand";
import { useUiState } from "./ui-state.store";

interface TasksStore {
  tasks: TaskDTO[];
  loadAllTasks: () => Promise<void>;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],

  loadAllTasks: async () => {
    const uiState = useUiState.getState();

    try {
      uiState.setIsLoading(true);

      const allTasksData = await fetchAllTasks();

      set({ tasks: allTasksData.tasks });
    } finally {
      uiState.setIsLoading(false);
    }
  },
}));
