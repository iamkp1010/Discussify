import API from "./axiosConfig"

export const createPostApi = async (data) => await API.post("/posts/create", data)
export const fetchPostsApi = async (query) => await API.get("/posts")