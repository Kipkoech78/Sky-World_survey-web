import { useState, useEffect } from "react";
import { fetchSurveys, createSurvey, updateSurvey, deleteSurvey } from "../api";
import Modal from "@/components/admin-view/modal";


function SurveyForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    setLoading(true);
    try {
      await onSave({ name, description });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Survey Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Graduate Developer Application Survey"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Briefly describe the purpose of this survey…"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Saving…" : initial ? "Save Changes" : "Create Survey"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function SurveyManagement({ navigate }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | "create" | {survey}
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setSurveys(await fetchSurveys());
    } catch (e) {
      setError("Failed to load surveys. Check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data) => {
    await createSurvey(data);
    setModal(null);
    load();
  };

  const handleEdit = async (data) => {
    await updateSurvey(modal.survey.id, data);
    setModal(null);
    load();
  };

  const handleDelete = async (survey) => {
    setDeleting(survey.id);
    try {
      await deleteSurvey(survey.id);
      load();
    } catch (e) {
      setError("Failed to delete survey.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Surveys</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create and manage your survey collection</p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <span>+</span> New Survey
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 py-12">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading surveys…
        </div>
      ) : surveys.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-700 font-medium">No surveys yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first survey to get started</p>
          <button onClick={() => setModal("create")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Create Survey
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {surveys.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                #{s.id}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{s.name}</p>
                <p className="text-sm text-slate-500 truncate">{s.description || "No description"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate("questions", s)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Questions
                </button>
                <button
                  onClick={() => navigate("responses", s)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Responses
                </button>
                <button
                  onClick={() => setModal({ survey: s })}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s)}
                  disabled={deleting === s.id}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === s.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === "create" && (
        <Modal title="New Survey" onClose={() => setModal(null)}>
          <SurveyForm onSave={handleCreate} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.survey && (
        <Modal title="Edit Survey" onClose={() => setModal(null)}>
          <SurveyForm initial={modal.survey} onSave={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}