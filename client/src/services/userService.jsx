import API from "./axiosConfig"

export const fetchUserInfoApi = async (id) => await API.get(`/users/${id}`)
export const fetchRandsomUserApi = async (query) => await API.get(`/users/random`, {params: query})
export const updateUserApi = async (data) => await API.post("users/update", data)
