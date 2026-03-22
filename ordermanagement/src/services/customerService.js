
import API from "./api";

export const getCustomers = () => API.get("/customers");
export const addCustomer = (data) => API.post("/customers", data);