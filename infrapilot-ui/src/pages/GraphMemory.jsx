import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import axios from "axios";

export default function GraphMemory() {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/graph")
      .then(res => {
        // Expecting res.data to be { nodes: [{id, label, ...}], edges: [{id, source, target, ...}] }
        const { nodes = [], edges = [] } = res.data || {};
        setElements([
          ...nodes.map(n => ({ id: n.id, data: { label: n.label }, position: n.position || { x: 0, y: 0 } })),
          ...edges.map(e => ({ id: e.id, source: e.source, target: e.target, animated: true }))
        ]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dependency graph.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Infrastructure Dependency Graph</h1>
      {loading && <div>Loading graph...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div style={{ height: 600, background: "#f9fafb", borderRadius: 12 }}>
          <ReactFlow elements={elements} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      )}
    </div>
  );
} 