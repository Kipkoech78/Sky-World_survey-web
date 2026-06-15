import { useState } from "react";
import SurveyManagement from "./pages/SurveyManagement";
import QuestionManagement from "./pages/QuestionManagement";
import SurveyResponses from "./pages/SurveyResponse";
import AvailableSurveys from "./pages/AvailableSurveys";
import Sidebar from "./components/sidebar";
import SurveyForm from "./pages/SurveyForm";
// import SurveyManagement from "./pages/SurveyManagement";
// import QuestionManagement from "./pages/QuestionManagement";
// import AvailableSurveys from "./pages/AvailableSurveys";
// import SurveyForm from "./pages/SurveyForm";
// import SurveyResponses from "./pages/SurveyResponses";
// import Sidebar from "./components/Sidebar";

export default function App() {
  const [page, setPage] = useState("surveys");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [mode, setMode] = useState("admin"); // "admin" | "user"

  const navigate = (p, survey = null) => {
    setSelectedSurvey(survey);
    setPage(p);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-[#0F1B2D] text-white px-6 py-3 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-sm">SW</div>
          <span className="font-semibold text-lg tracking-tight">Sky World Surveys</span>
        </div>
        <div className="flex gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => { setMode("admin"); navigate("surveys"); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "admin" ? "bg-white text-[#0F1B2D]" : "text-white/70 hover:text-white"}`}
          >
            Admin
          </button>
          <button
            onClick={() => { setMode("user"); navigate("available"); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "user" ? "bg-white text-[#0F1B2D]" : "text-white/70 hover:text-white"}`}
          >
            Respondent
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {mode === "admin" && (
          <Sidebar page={page} navigate={navigate} selectedSurvey={selectedSurvey} />
        )}

        <main className={`flex-1 ${mode === "admin" ? "ml-0" : ""}`}>
          {page === "surveys" && mode === "admin" && (
            <SurveyManagement navigate={navigate} />
          )}
          {page === "questions" && mode === "admin" && (
            <QuestionManagement survey={selectedSurvey} navigate={navigate} />
          )}
          {page === "responses" && mode === "admin" && (
            <SurveyResponses survey={selectedSurvey} navigate={navigate} />
          )}
          {page === "available" && mode === "user" && (
            <AvailableSurveys navigate={navigate} />
          )}
          {page === "form" && mode === "user" && (
            <SurveyForm survey={selectedSurvey} navigate={navigate} />
          )}
        </main>
      </div>
    </div>
  );
}