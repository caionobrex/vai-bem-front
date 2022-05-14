import { Axios, AxiosRequestConfig } from "axios";

const api = new Axios({
  baseURL: process.env.baseURL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = !localStorage.getItem('token')
  if (!token) return
  if (config.headers) config.headers.Authorization = `Bearer ${token}`
})

export default api