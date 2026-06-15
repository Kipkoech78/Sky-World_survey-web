export default function Sidebar({ page, navigate, selectedSurvey }) {
  const items = [
    { id: "surveys", label: "Surveys", icon: "📋" },
    ...(selectedSurvey
      ? [
          { id: "questions", label: "Questions", icon: "❓", sub: selectedSurvey.name },
          { id: "responses", label: "Responses", icon: "📊", sub: selectedSurvey.name },
        ]
      : []),
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200 min-h-full flex flex-col py-4 px-3 gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Navigation</p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.id, item.id !== "surveys" ? selectedSurvey : null)}
          className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all w-full
            ${page === item.id
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
        >
          <span className="mt-0.5">{item.icon}</span>
          <div>
            <div>{item.label}</div>
            {item.sub && <div className="text-xs text-slate-400 truncate w-36">{item.sub}</div>}
          </div>
        </button>
      ))}
    </aside>
  );
}