import { useState } from "react";
import axios from "axios";
import RCACard from "@/components/RCACard";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/rca/similarity?query=${encodeURIComponent(query)}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to fetch similar RCAs.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Semantic RCA Search</h1>
      <div className="flex gap-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Describe your issue or paste logs..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="mt-4 space-y-4">
        {results.map(rca => <RCACard key={rca.id} rca={rca} />)}
        {!loading && results.length === 0 && query && !error && (
          <div className="text-gray-500">No similar RCAs found.</div>
        )}
      </div>
    </div>
  );
} 