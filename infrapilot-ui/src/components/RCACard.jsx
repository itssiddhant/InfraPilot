// src/components/RCACard.jsx
import { Card, CardContent } from "@/components/ui/card";

export default function RCACard({ rca }) {
  return (
    <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-10 transition-all hover:shadow-3xl overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-2">
        {rca.alert_id && (
          <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            Alert: {rca.alert_id}
          </span>
        )}
        <span className="inline-flex items-center px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-mono rounded-full border border-gray-300 dark:border-gray-700">
          #{rca.id}
        </span>
      </div>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Summary</h2>
        </div>
        <div className="mb-6">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
            {rca.summary}
          </p>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-gray-400 font-mono">
            {new Date(rca.created_at).toLocaleString()}
          </span>
        </div>
        {rca.suggested_fix && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 rounded-lg flex items-start gap-3 shadow-inner">
            <span className="text-yellow-700 dark:text-yellow-300 text-2xl">💡</span>
            <div>
              <span className="text-yellow-700 dark:text-yellow-200 font-semibold">Suggested Fix:</span>
              <span className="ml-2 text-yellow-800 dark:text-yellow-100 text-base">{rca.suggested_fix}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
