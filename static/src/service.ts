const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8787'
    : 'https://api.example.com';

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
