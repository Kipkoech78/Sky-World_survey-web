import { useState, useEffect, useCallback } from "react";
import { fetchResponses, getCertificateUrl } from "../api";

export default function SurveyResponses({ survey, navigate }) {
  const [data, setData] = useState({ responses: [], currentPage: 1, lastPage: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [emailFilter, setEmailFilter] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchResponses(survey.id, { page, pageSize: 10, email: emailFilter });
      setData(result);
    } catch (e) {
      setError("Failed to load responses.");
    } finally {
      setLoading(false);
    }
  }, [survey?.id, page, emailFilter]);

  useEffect(() => { load(); }, [load]);

  const applyFilter = () => {
    setPage(1);
    setEmailFilter(emailInput);
  };

  const clearFilter = () => {
    setEmailInput("");
    setEmailFilter("");
    setPage(1);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={() => navigate("surveys")} className="text-slate-400 hover:text-slate-600 text-sm">Surveys</button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 text-sm font-medium truncate">{survey?.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Responses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{data.totalCount} total response{data.totalCount !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilter()}
            placeholder="Filter by email address…"
            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button onClick={applyFilter} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Search
        </button>
        {emailFilter && (
          <button onClick={clearFilter} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Clear
          </button>
        )}
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 py-12">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading responses…
        </div>
      ) : data.responses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-700 font-medium">No responses found</p>
          <p className="text-slate-400 text-sm mt-1">{emailFilter ? "Try a different email filter" : "Responses will appear here once submitted"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.responses.map((r) => (
            <div key={r.responseId} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(expanded === r.responseId ? null : r.responseId)}
              >
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-blue-600 text-sm shrink-0">
                  {(r.fullName || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{r.fullName || "—"}</p>
                  <p className="text-sm text-slate-500 truncate">{r.emailAddress}</p>
                </div>
                <div className="text-xs text-slate-400 shrink-0 hidden sm:block">{r.dateResponded?.slice(0, 10)}</div>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${expanded === r.responseId ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expanded === r.responseId && (
                <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50">
                  {r.gender && (
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Gender</p>
                      <p className="text-sm text-slate-700">{r.gender}</p>
                    </div>
                  )}
                  {r.description && (
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Description</p>
                      <p className="text-sm text-slate-700">{r.description}</p>
                    </div>
                  )}
                  {r.answers && Object.entries(r.answers).length > 0 && (
  Object.entries(r.answers).map(([key, value]) => (
    value ? (
      <div key={key}>
        <p className="text-xs text-slate-400 mb-0.5">
          {/* Convert snake_case / PascalCase to readable label */}
          {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()}
        </p>
        {value.includes(",") ? (
          <div className="flex flex-wrap gap-1">
            {value.split(",").map((v) => (
              <span key={v.trim()} className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {v.trim()}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-700">{value}</p>
        )}
      </div>
    ) : null
  ))
)}
                  {r.programmingStack && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Programming Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {r.programmingStack.split(",").map((s) => (
                          <span key={s.trim()} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {r.certificates?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Certificates</p>
                      <div className="space-y-1">
                        {r.certificates.map((c) => (
                          <a
                            key={c.id}
                            href={getCertificateUrl(c.id)}
                            download
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 group"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="underline underline-offset-2">{c.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-400">Submitted: {r.dateResponded}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40"
          >
            ← Prev
          </button>
          {Array.from({ length: data.lastPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-sm rounded-lg transition-colors
                ${p === page ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(data.lastPage, p + 1))}
            disabled={page === data.lastPage}
            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}