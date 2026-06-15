import { useState, useEffect } from "react";
import { fetchSurveys, fetchQuestions } from "../api";

export default function AvailableSurveys({ navigate }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionCounts, setQuestionCounts] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSurveys();
        setSurveys(data);
        // Fetch question counts in parallel
        const counts = await Promise.all(
          data.map(async (s) => {
            try {
              const qs = await fetchQuestions(s.id);
              return [s.id, qs.length];
            } catch {
              return [s.id, 0];
            }
          })
        );
        setQuestionCounts(Object.fromEntries(counts));
      } catch (e) {
        setError("Could not load surveys. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#0F1B2D]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 mb-6">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Available Surveys</h1>
          <p className="text-slate-400">Select a survey below to share your feedback</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p>Loading surveys…</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium text-slate-300">No surveys available</p>
            <p className="text-sm mt-1">Check back later</p>
          </div>
        ) : (
          <div className="space-y-3">
            {surveys.map((s) => {
              const count = questionCounts[s.id];
              return (
                <div key={s.id}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-400/40 transition-all cursor-pointer group"
                  onClick={() => navigate("form", s)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-white font-semibold group-hover:text-blue-300 transition-colors">{s.name}</h2>
                      {s.description && <p className="text-slate-400 text-sm mt-1">{s.description}</p>}
                      {count !== undefined && (
                        <p className="text-slate-500 text-xs mt-2">
                          {count} question{count !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all">
                      <svg className="w-4 h-4 text-blue-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}