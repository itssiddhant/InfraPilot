// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import RCACard from "@/components/RCACard";

export default function Dashboard() {
  const [rcas, setRCAs] = useState([]);

  useEffect(() => {
    axios.get("/api/rca/history")
      .then((res) => {
        console.log("RCA history response:", res.data);
        setRCAs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to load RCA history", err);
        setRCAs([]); // fallback to empty array on error
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/40 via-blue-200/60 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-white tracking-tight drop-shadow-lg">RCA History</h1>
        <div>
          {rcas.map((rca) => (
            <RCACard key={rca.id} rca={rca} />
          ))}
        </div>
      </div>
    </div>
  );
}
