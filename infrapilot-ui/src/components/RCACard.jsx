// src/components/RCACard.jsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ThumbsUp, ThumbsDown, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { client } from '../api/client';
import IncidentTimeline from './Timeline/IncidentTimeline';
import { cn } from '@/lib/utils';

export default function RCACard({ rca }) {
  const [showTimeline, setShowTimeline] = useState(false);

  const handleFeedback = async (feedback) => {
    try {
      await client.post(`/rca/${rca.id}/feedback`, { feedback });
      alert(`Feedback '${feedback}' submitted!`);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await client.get(`/rca/${rca.id}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rca-report-${rca.id}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to export RCA:", error);
      alert("Failed to export RCA.");
    }
  };
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getTimeDifference = (start, end) => {
    if (!start || !end) return 'N/A';
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / 60000);
    const seconds = ((diff % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  };

  const incidentDuration = getTimeDifference(rca.incident_start_time, rca.incident_resolved_time);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-xl text-white">Root Cause Analysis Report</h3>
                <p className="text-sm text-gray-400">Generated on {formatDateTime(rca.created_at)}</p>
            </div>
            <span className="font-mono text-xs bg-black/30 text-gray-400 px-2 py-1 rounded border border-white/10">ID: #{rca.id}</span>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 font-semibold flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> INCIDENT START</p>
                <p className="text-sm font-mono text-gray-200 mt-1">{formatDateTime(rca.incident_start_time)}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 font-semibold flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> INCIDENT END</p>
                <p className="text-sm font-mono text-gray-200 mt-1">{formatDateTime(rca.incident_resolved_time)}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 font-semibold flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> DURATION</p>
                <p className="text-sm font-mono text-gray-200 mt-1">{incidentDuration}</p>
            </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-white mb-2">Summary</h4>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {rca.summary}
          </p>
        </div>
        
        {rca.suggested_fix && (
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <h4 className="font-semibold text-blue-300">💡 Suggested Fix</h4>
            <p className="mt-2 text-blue-200/90">{rca.suggested_fix}</p>
          </div>
        )}
      </div>

      <div className="bg-black/20 border-t border-white/10 px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={() => handleFeedback('good')} variant="ghost" size="sm" className="text-gray-300 hover:bg-green-500/20 hover:text-white">
              <ThumbsUp className="h-4 w-4 mr-2" /> Useful
          </Button>
          <Button onClick={() => handleFeedback('bad')} variant="ghost" size="sm" className="text-gray-300 hover:bg-red-500/20 hover:text-white">
              <ThumbsDown className="h-4 w-4 mr-2" /> Not Useful
          </Button>
          <Button onClick={() => setShowTimeline(!showTimeline)} variant="outline" size="sm" className="border-white/20 bg-black/20 text-gray-300 hover:bg-white/10 hover:text-white">
              <Eye className="h-4 w-4 mr-2" /> {showTimeline ? 'Hide' : 'View'} Timeline
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm" className="border-white/20 bg-black/20 text-gray-300 hover:bg-white/10 hover:text-white">
              <ArrowDownToLine className="h-4 w-4 mr-2" /> Export
          </Button>
      </div>

      {showTimeline && (
        <div className="bg-black/30 p-6 border-t border-white/10">
          <IncidentTimeline rawLogs={rca.logs} />
        </div>
      )}
    </div>
  );
}
