import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { client } from '@/api/client';

const initialNodes = [];
const initialEdges = [];

export default function GraphMemory() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await client.get('/graph');
        const { nodes: apiNodes = [], edges: apiEdges = [] } = response.data;
        
        // Ensure nodes have a position property
        const positionedNodes = apiNodes.map(node => ({
          ...node,
          position: node.position || { x: Math.random() * 400, y: Math.random() * 400 }
        }));

        setNodes(positionedNodes);
        setEdges(apiEdges);
      } catch (err) {
        setError('Failed to load dependency graph.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraphData();
  }, []);

  return (
    <div className="p-4 sm:p-8 h-full">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Graph Memory</h1>
        <p className="text-gray-400 mt-2">An interactive map of your infrastructure's dependencies.</p>
      </header>
      <div className="w-full h-[70vh] rounded-2xl bg-gray-900/80 backdrop-blur-md border border-gray-700 p-4">
        {loading && <div className="text-center text-gray-400">Loading graph...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Controls />
              <Background color="#4b5563" gap={16} />
            </ReactFlow>
        )}
      </div>
    </div>
  );
} 