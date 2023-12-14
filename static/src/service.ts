const API_URL = import.meta.env.VITE_API_URL;

export async function createPaste(content: string) {
  const res = await fetch(`${API_URL}/api/create`, {
    method: 'POST',
    body: JSON.stringify({ content }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
}

export async function getPaste(id: string) {
  const res = await fetch(`${API_URL}/api/get?id=${id}`);
  const data = await res.json();
  return data;
}
