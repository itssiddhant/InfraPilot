// src/pages/RCAForm.jsx
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function RCAForm() {
  const [logs, setLogs] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/rca", {
        logs: logs.split("\n"),
      });
      setResponse(res.data);
    } catch (err) {
      console.error("RCA submission failed", err);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Submit Logs for RCA</h1>
      <Textarea
        rows={10}
        placeholder="Paste logs here, one per line..."
        value={logs}
        onChange={(e) => setLogs(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Run RCA"}
      </Button>
      {response && (
        <div className="mt-4 bg-muted p-4 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-1">Summary</h2>
          <p className="text-sm whitespace-pre-wrap">{response.summary}</p>
        </div>
      )}
    </div>
  );
}
