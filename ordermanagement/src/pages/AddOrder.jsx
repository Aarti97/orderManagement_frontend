import { useState } from "react";
import { addOrder } from "../services/orderService";

export default function AddOrder() {
  const [productName, setProductName] = useState("");

  const submit = async () => {
    await addOrder({ productName });
    alert("Order Added");
  };

  return (
    <>
      <input onChange={(e) => setProductName(e.target.value)} />
      <button onClick={submit}>Save</button>
    </>
  );
}