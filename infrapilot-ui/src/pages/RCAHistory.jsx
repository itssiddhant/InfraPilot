import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function RCAHistory() {
  const [rcas, setRcas] = useState([]);

  useEffect(() => {
    api.get("/rca/history").then((res) => setRcas(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">RCA History</h1>
      <div className="space-y-4">
        {rcas.map((rca) => (
          <div key={rca.id} className="p-4 border rounded-xl shadow bg-white">
            <p className="text-sm text-gray-500">#{rca.id} • {new Date(rca.created_at).toLocaleString()}</p>
            <p className="text-lg font-medium">{rca.summary.slice(0, 150)}...</p>
            {rca.suggested_fix && (
              <p className="mt-2 text-green-600">💡 {rca.suggested_fix}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
