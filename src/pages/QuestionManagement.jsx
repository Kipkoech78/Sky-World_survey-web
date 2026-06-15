import { useState, useEffect } from "react";
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from "../api";
import Modal from "@/components/admin-view/modal";


const QUESTION_TYPES = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "email", label: "Email" },
  { value: "single_choice", label: "Choice (Single)" },
  { value: "multiple_choice", label: "Choice (Multiple)" },
  { value: "file", label: "File Upload" },
];

const TYPE_LABELS = {
  short_text: "Short Text",
  long_text: "Long Text",
  email: "Email",
  single_choice: "Single_Choice",
  multiple_choice: "multi_Choice",
  file: "File Upload",
};

const TYPE_COLORS = {
  short_text: "bg-sky-50 text-sky-700",
  long_text: "bg-violet-50 text-violet-700",
  email: "bg-amber-50 text-amber-700",
  single_choice: "bg-green-50 text-green-700",
  multiple_choice: "bg-green-50 text-green-700",
  file: "bg-rose-50 text-rose-700",
};

function QuestionForm({ initial, onSave, onCancel }) {
  const [type, setType] = useState(initial?.type || "short_text");
  const [name, setName] = useState(initial?.name || "");
  const [text, setText] = useState(initial?.text || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [required, setRequired] = useState(initial?.required ?? true);
  const [multiple, setMultiple] = useState(initial?.multiple ?? false);
  const [options, setOptions] = useState(initial?.options || []);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [fileFormat, setFileFormat] = useState(initial?.fileProperties?.format || ".pdf");
  const [maxFileSize, setMaxFileSize] = useState(initial?.fileProperties?.maxFileSize || "1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (!newOptionValue.trim() || !newOptionLabel.trim()) return;
    setOptions([...options, { value: newOptionValue.trim().toUpperCase(), label: newOptionLabel.trim() }]);
    setNewOptionValue("");
    setNewOptionLabel("");
  };

  const removeOption = (i) => setOptions(options.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) { setError("Name and question text are required."); return; }
    if (type === "multiple_choice" && options.length < 2) { setError("Choice questions need at least 2 options."); return; }
    if (type === "single_choice" && options.length < 2) { setError("Choice questions need at least 2 options."); return; }
    setLoading(true);
    try {
      await onSave({ type, name, text, description, required, multiple, options, fileFormat, maxFileSize });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Field Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. full_name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Question Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
        <input value={text} onChange={(e) => setText(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What is your full name?" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description / Hint</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional helper text for respondents" />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)}
            className="rounded text-blue-600" />
          <span className="text-sm text-slate-700">Required</span>
        </label>
        {type === "multiple_choice" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)}
              className="rounded text-blue-600" />
            <span className="text-sm text-slate-700">Allow multiple selections</span>
          </label>
        )}
        {type === "file" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)}
              className="rounded text-blue-600" />
            <span className="text-sm text-slate-700">Allow multiple files</span>
          </label>
        )}
      </div>

      {type === "single_choice" && (
        <div className="border border-slate-200 rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium text-slate-700">Options</p>
          {options.map((o, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">{o.value}</span>
              <span className="flex-1 text-slate-700">{o.label}</span>
              <button type="button" onClick={() => removeOption(i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <input value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)}
              className="w-24 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Value" />
            <input value={newOptionLabel} onChange={(e) => setNewOptionLabel(e.target.value)}
              className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Label" />
            <button type="button" onClick={addOption}
              className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-xs font-medium transition-colors">
              Add
            </button>
          </div>
        </div>
      )}
      {type === "multiple_choice" && (
        <div className="border border-slate-200 rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium text-slate-700">Options</p>
          {options.map((o, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">{o.value}</span>
              <span className="flex-1 text-slate-700">{o.label}</span>
              <button type="button" onClick={() => removeOption(i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <input value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)}
              className="w-24 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Value" />
            <input value={newOptionLabel} onChange={(e) => setNewOptionLabel(e.target.value)}
              className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Label" />
            <button type="button" onClick={addOption}
              className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-xs font-medium transition-colors">
              Add
            </button>
          </div>
        </div>
      )}

      {type === "file" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Accepted Format</label>
            <input value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=".pdf" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max File Size (MB)</label>
            <input type="number" value={maxFileSize} onChange={(e) => setMaxFileSize(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1" />
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60">
          {loading ? "Saving…" : initial ? "Save Changes" : "Add Question"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function QuestionManagement({ survey, navigate }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setQuestions(await fetchQuestions(survey.id));
    } catch (e) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [survey?.id]);

  const handleCreate = async (data) => {
    await createQuestion(survey.id, data);
    setModal(null);
    load();
  };

  const handleEdit = async (data) => {
    await updateQuestion(survey.id, modal.question.id, data);
    setModal(null);
    load();
  };

  const handleDelete = async (q) => {
    setDeleting(q.id);
    try {
      await deleteQuestion(survey.id, q.id);
      load();
    } catch (e) {
      setError("Failed to delete question.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={() => navigate("surveys")} className="text-slate-400 hover:text-slate-600 text-sm">Surveys</button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 text-sm font-medium truncate">{survey?.name}</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Questions</h1>
          <p className="text-sm text-slate-500 mt-0.5">{questions.length} question{questions.length !== 1 ? "s" : ""} in this survey</p>
        </div>
        <button onClick={() => setModal("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <span>+</span> Add Question
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 py-12">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading questions…
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="text-4xl mb-3">❓</div>
          <p className="text-slate-700 font-medium">No questions yet</p>
          <p className="text-slate-400 text-sm mt-1">Add your first question to this survey</p>
          <button onClick={() => setModal("create")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Add Question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id || i} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400 font-mono">#{i + 1}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[q.type] || "bg-slate-100 text-slate-600"}`}>
                      {TYPE_LABELS[q.type] || q.type}
                    </span>
                    {q.required && <span className="text-xs text-red-500 font-medium">Required</span>}
                  </div>
                  <p className="font-semibold text-slate-800">{q.text}</p>
                  {q.description && <p className="text-sm text-slate-500 mt-0.5">{q.description}</p>}
                  {q.options?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {q.options.map((o) => (
                        <span key={o.value} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{o.label}</span>
                      ))}
                      <span className="text-xs text-slate-400 ml-1">({q.multiple ? "multiple" : "single"} choice)</span>
                    </div>
                  )}
                  {q.fileProperties && (
                    <p className="text-xs text-slate-400 mt-1">
                      {q.fileProperties.format} · max {q.fileProperties.maxFileSize}{q.fileProperties.maxFileSizeUnit}
                      {q.fileProperties.multiple && " · multiple allowed"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setModal({ question: q })}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(q)} disabled={deleting === q.id}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                    {deleting === q.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === "create" && (
        <Modal title="Add Question" onClose={() => setModal(null)}>
          <QuestionForm onSave={handleCreate} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.question && (
        <Modal title="Edit Question" onClose={() => setModal(null)}>
          <QuestionForm initial={modal.question} onSave={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}