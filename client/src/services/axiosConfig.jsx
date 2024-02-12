import axios from "axios"
import { BACKEND_URL } from "../config"
import { removeUserDataFromLocalStorage } from "../helpers/authHelper";

const API = await axios.create({baseURL:`${BACKEND_URL}`, withCredentials: true})

API.interceptors.response.use(
    (res) => res.data,
    async (err) => {
        if(err.response?.status === 401){
            try{
                const axiosInstance = await axios.create({baseURL:`${BACKEND_URL}/auth`, withCredentials: true}) 
                await axiosInstance.post("/tokenRefresh");
                return API.request(err.config)
            }
            catch(e){
                removeUserDataFromLocalStorage()
                window.location.href = '/login';
                return {status: e?.response?.status, error: (err?.response?.data?.error || err.message) }
            }
        }
        else return {error: (err?.response?.data?.error || err.message)}
    }
)
export default API