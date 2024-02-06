import API from "./axiosConfig"

export const createCommentApi = async (data) => await API.post("/comments", data)
export const updateCommentApi = async (id, data) => await API.patch(`/comments/${id}`, data)
export const deleteCommentApi = async (id) => await API.delete(`/comments/${id}`)
export const fetchCommentsApi = async (query) => await API.get("/comments", {params: query})
export const voteCommentApi = async (id, data) => await API.post(`/comments/vote/${id}`, data)