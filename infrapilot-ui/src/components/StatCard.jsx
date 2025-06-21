import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatCard({ title, value, icon, description }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-6">
        <div className="bg-blue-600/30 text-blue-300 border border-blue-500/50 rounded-lg p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
    </div>
  );
} 