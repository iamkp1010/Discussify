import API from "./axiosConfig"

export const loginWithGoogleApi = async (code) => await API.post("/auth/google", code)
export const loginApi = async (user) => await API.post("/auth/login", user)
export const registerApi = async (user) => await API.post("/auth/register", user)
export const logoutApi = async (userId) => await API.post("/auth/logout",{userId})
export const protectedApi = async () => await API.post("/auth/protected")