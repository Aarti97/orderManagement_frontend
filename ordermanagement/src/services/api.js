import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL:"https://ordermanagement-backend-production.up.railway.app/api",
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});

export default API;