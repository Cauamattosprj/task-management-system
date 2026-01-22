import type { UserRegisterDTO } from "@shared/types/dto/user/register.dto";

export async function register(payload: UserRegisterDTO) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then(async (v) => await v.json());

  return res;
}
