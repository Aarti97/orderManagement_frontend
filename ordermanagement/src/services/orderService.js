import API from "./api";

export const getOrders = () => API.get("/orders");
export const addOrder = (data) => API.post("/orders", data);