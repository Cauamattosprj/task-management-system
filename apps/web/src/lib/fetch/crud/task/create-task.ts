import type { CreateTaskFormData } from "@/schemas/create-task-schema";

export async function createTask(payload: CreateTaskFormData) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(async (v) => await v.json());

  console.log(res);
}
