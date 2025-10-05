export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (err) {
    console.warn("setUser: failed to stringify user", err);
  }
};

export const clearUser = () => {
  localStorage.removeItem("user");
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) return token;
  const user = getUser();
  return user?.token || null;
};

export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");
