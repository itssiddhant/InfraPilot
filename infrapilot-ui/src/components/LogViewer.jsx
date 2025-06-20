// src/pages/LogViewer.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function LogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/logs").then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ingested Logs</h1>
      <div className="space-y-2 text-sm font-mono bg-muted p-4 rounded-xl max-h-[600px] overflow-auto">
        {logs.map((log) => (
          <div key={log.id}>
            [{log.timestamp}] {log.service}: {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
