// src/pages/RCAList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import RCACard from "@/components/RCACard";

export default function RCAList() {
  const [rcas, setRcas] = useState([]);

  useEffect(() => {
    axios.get("/api/rca/history").then((res) => setRcas(res.data));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">RCA Records</h1>
      {rcas.map((rca) => (
        <RCACard key={rca.id} rca={rca} />
      ))}
    </div>
  );
}
