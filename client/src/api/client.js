const request = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Something went wrong");
  return payload;
};

export const authApi = {
  me: () => request("/api/auth/me"),
  login: (credentials) => request("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (user) => request("/api/auth/register", { method: "POST", body: JSON.stringify(user) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
};

export default request;
