import { useAuth } from "@/store/auth.store";
import type { UserDTO } from "@/types/user.dto";

export async function getUserById(id: string) {
  const { accessToken } = useAuth.getState();

  const res: UserDTO = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(async (v) => await v.json());

  console.log("Get user by id res", res);
  return res;
}
