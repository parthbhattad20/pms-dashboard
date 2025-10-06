import api from "./api";

export const loginUser = async (email, password) => {
  const res = await api.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = res.data;
  return data;
};

export const signupUser = async (
  name,
  email,
  password
) => {
  const res = await api.post("/user/register", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await api.get("/user/verify");
  console.log(res.data)
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = res.data;
  return data;
};

export const logoutUser = async () => {
    const res = await api.get("/user/logout");
    if (res.status !== 200) {
      throw new Error("Unable to delete chats");
    }
    const data = res.data;
    return data;
  };