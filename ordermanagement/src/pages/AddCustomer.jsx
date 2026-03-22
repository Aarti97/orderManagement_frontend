import { useState } from "react";
import { addCustomer } from "../services/customerService";

export default function AddCustomer() {
  const [name, setName] = useState("");

  const submit = async () => {
    await addCustomer({ name });
    alert("Customer Added");
  };

  return (
    <>
      <input onChange={(e) => setName(e.target.value)} />
      <button onClick={submit}>Save</button>
    </>
  );
}