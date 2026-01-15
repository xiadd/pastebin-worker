import qs from "qs";

const getApiBase = () => {
  if (typeof window === "undefined") return "";
  return window.location.origin;
};

const buildApiUrl = (path: string) => {
  const base = getApiBase();
  return base ? `${base}${path}` : path;
};

export async function createPaste(body: any) {
  const res = await fetch(buildApiUrl("/api/create"), {
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
  const res = await fetch(buildApiUrl(`/api/get?${query}`));
  const data = await res.json();
  return data;
}

export async function updatePaste(body: any) {
  const res = await fetch(buildApiUrl("/api/update"), {
    method: "POST",
    body: JSON.stringify({ ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}
