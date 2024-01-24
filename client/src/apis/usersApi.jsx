// import axios from "axios"
// import { BACKEND_URL } from "../config"
// import { removeUserDataFromLocalStorage } from "../helpers/authHelper";
// const API = await axios.create({baseURL:`${BACKEND_URL}/users`, withCredentials: true})

// API.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//         if(err.response?.status === 401){
//             try{
//                 const axiosInstance = await axios.create({baseURL:`${BACKEND_URL}/users`, withCredentials: true}) 
//                 await axiosInstance.post("/tokenRefresh");
//                 return API.request(err.config)
//             }
//             catch(e){
//                 removeUserDataFromLocalStorage()
//                 e.status = e?.response?.status
//                 return e
//             }
//         }
//         else throw err
//     }
// )

import API from "./axiosConfig"

export const loginWithGoogleApi = async (code) => await API.post("/users/auth/google", code)
export const loginApi = async (user) => await API.post("/users/login", user)
export const registerApi = async (user) => await API.post("/users/register", user)
export const logoutApi = async (userId) => await API.post("/users/logout",{userId})
export const protectedApi = async () => await API.post("/users/protected")
