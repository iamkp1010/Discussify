import API from "./axiosConfig"

export const createPostApi = async (data) => await API.post("/posts/create", data)
export const fetchPostsApi = async (query) => await API.get("/posts",{params:query})
export const deletePostApi = async (id) => await API.delete(`/posts/${id}`)
export const updatePostApi = async (id, data) => await API.put(`/posts/${id}`, data)
export const fetchVotedPostApi = async(query) => await API.get("/posts/fetchVotedPost",{params: query})