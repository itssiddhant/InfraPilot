// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { client } from "@/api/client";
import RCACard from "@/components/RCACard";
import StatCard from "@/components/StatCard";
import { FileText, Server, Timer } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRcas: 0,
    totalServices: 0,
    avgRcaTime: 0,
  });
  const [recentRcas, setRecentRcas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rcaRes = await client.get("/rca/history");
        const graphRes = await client.get("/graph");

        const rcas = Array.isArray(rcaRes.data) ? rcaRes.data : [];
        const services = Array.isArray(graphRes.data.nodes) ? graphRes.data.nodes : [];

        let totalRcaTime = 0;
        let rcasWithTime = 0;
        rcas.forEach(rca => {
            if (rca.incident_start_time && rca.incident_resolved_time) {
                const startTime = new Date(rca.incident_start_time);
                const endTime = new Date(rca.incident_resolved_time);
                totalRcaTime += endTime - startTime; // Difference in milliseconds
                rcasWithTime++;
            }
        });
        
        const avgRcaTime = rcasWithTime > 0 ? (totalRcaTime / rcasWithTime).toFixed(0) : 0;

        setStats({
          totalRcas: rcas.length,
          totalServices: services.length,
          avgRcaTime: avgRcaTime,
        });

        setRecentRcas(rcas.slice(0, 3));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total RCAs Generated"
            value={stats.totalRcas}
            icon={<FileText className="h-6 w-6" />}
          />
          <StatCard 
            title="Services Monitored"
            value={stats.totalServices}
            icon={<Server className="h-6 w-6" />}
          />
          <StatCard 
            title="Average RCA Time"
            value={`${stats.avgRcaTime} ms`}
            icon={<Timer className="h-6 w-6" />}
          />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        {recentRcas.length > 0 ? (
          <div className="space-y-8">
            {recentRcas.map((rca) => (
              <RCACard key={rca.id} rca={rca} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-2xl bg-white/5">
            <p className="font-medium">No recent RCA records found.</p>
            <p className="text-sm mt-2">Run an analysis to see activity here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
