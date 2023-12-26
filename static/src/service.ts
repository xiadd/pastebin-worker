import qs from "qs";

const API_URL = import.meta.env.VITE_API_URL;

export async function createPaste(body: any) {
  const res = await fetch(`${API_URL}/api/create`, {
    method: "POST",
    body: JSON.stringify({ ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}

export async function getPaste(
  id: string,
  share_password?: string | undefined | null,
) {
  const query = qs.stringify({ id, share_password }, { skipNulls: true });
  const res = await fetch(`${API_URL}/api/get?${query}`);
  const data = await res.json();
  return data;
}
