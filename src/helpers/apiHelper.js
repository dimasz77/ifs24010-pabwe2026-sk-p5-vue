const TOKEN_KEY = "access_token";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Wrapper fetch ke REST API Delcom.
 * @param {string} path endpoint, contoh "/auth/login"
 * @param {{method?: string, params?: object, body?: object, form?: FormData}} options
 */
export async function apiFetch(path, { method = "GET", params = {}, body, form } = {}) {
  const url = new URL(`${DELCOM_BASEURL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value != null) url.searchParams.set(key, value);
  }

  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    body: form ?? (body ? JSON.stringify(body) : undefined),
  });
  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    throw new Error(json.message || "Terjadi kesalahan pada server");
  }
  return json;
}

/** Mengambil data[key] jika ada, jika tidak memakai data itu sendiri. */
export const unwrap = (json, key) => json.data?.[key] ?? json.data;
