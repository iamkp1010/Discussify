import axios from "axios"
import { BACKEND_URL } from "../config"
import { removeUserDataFromLocalStorage } from "../helpers/authHelper";

const API = await axios.create({baseURL:`${BACKEND_URL}`, withCredentials: true})

API.interceptors.response.use(
    (res) => res,
    async (err) => {
        if(err.response?.status === 401){
            try{
                const axiosInstance = await axios.create({baseURL:`${BACKEND_URL}/users`, withCredentials: true}) 
                await axiosInstance.post("/tokenRefresh");
                return API.request(err.config)
            }
            catch(e){
                removeUserDataFromLocalStorage()
                e.status = e?.response?.status
                return e
            }
        }
        else return err.response
    }
)

export default API