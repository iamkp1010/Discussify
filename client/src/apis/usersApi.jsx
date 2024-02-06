import API from "./axiosConfig"

export const loginWithGoogleApi = async (code) => await API.post("/users/auth/google", code)
export const loginApi = async (user) => await API.post("/users/login", user)
export const registerApi = async (user) => await API.post("/users/register", user)
export const logoutApi = async (userId) => await API.post("/users/logout",{userId})
export const protectedApi = async () => await API.post("/users/protected")
export const fetchUserInfoApi = async (id) => await API.get(`/users/${id}`)
export const fetchRandsomUserApi = async (query) => await API.get(`/users/random`, {params: query})
export const updateUserApi = async (data) => await API.post("users/update", data)
