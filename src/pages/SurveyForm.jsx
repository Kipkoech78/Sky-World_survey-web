import { useState, useEffect } from "react";
import { fetchQuestions, submitResponse } from "../api";

// ── Individual question controls ─────────────────────────────────────────────

function QuestionInput({ question, value, onChange }) {
  // console.log("Type", question)
  switch (question.type) {
    case "short_text":
    case "email":
      return (
        <input
          type={question.type === "email" ? "email" : "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.description || (question.type === "email" ? "your@email.com" : "Type your answer…")}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-lg"
        />
      );

    case "long_text":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.description || "Type your answer…"}
          rows={5}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors resize-none text-lg"
        />
      );

    case "choice":
      if (question.multiple) {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {question.options.map((o) => {
              const checked = selected.includes(o.value);
              return (
                <label key={o.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                    ${checked ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
                  <input type="checkbox" checked={checked} onChange={() => {
                    onChange(checked ? selected.filter((v) => v !== o.value) : [...selected, o.value]);
                  }} className="sr-only" />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors
                    ${checked ? "bg-blue-500 border-blue-500" : "border-white/30"}`}>
                    {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>}
                  </div>
                  <span className="text-white">{o.label}</span>
                </label>
              );
            })}
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            {question.options.map((o) => {
              const checked = value === o.value;
              return (
                <label key={o.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                    ${checked ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
                  <input type="radio" checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors
                    ${checked ? "border-blue-400" : "border-white/30"}`}>
                    {checked && <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />}
                  </div>
                  <span className="text-white">{o.label}</span>
                </label>
              );
            })}
          </div>
        );
      }
    case "multiple_choice": {
      const selected = Array.isArray(value) ? value : [];

      return (
        <div className="space-y-2">
          {question.options.map((o) => {
            const checked = selected.includes(o.value);

            return (
              <label key={o.value}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
              ${checked ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5 hover:border-white/40"}`}>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onChange(
                      checked
                        ? selected.filter((v) => v !== o.value)
                        : [...selected, o.value]
                    );
                  }}
                  className="sr-only"
                />

                <span className="text-white">{o.label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    case "single_choice": {
      console.log("option", question.options)
      return (
        <div className="space-y-2">
          {question.options.map((o) => {
            const checked = value === o.value;

            return (
              <label key={o.value}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
              ${checked ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5 hover:border-white/40"}`}>

                <input
                  type="radio"
                  checked={checked}
                  onChange={() => onChange(o.value)}
                  className="sr-only"
                />

                <span className="text-white">{o.label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    case "file":
      const fp = question.fileProperties;
      const files = Array.isArray(value) ? value : [];
      return (
        <div>
          <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-400/50 hover:bg-white/5 transition-all">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Click to upload</p>
              <p className="text-slate-400 text-sm mt-1">
                {fp?.format || ".pdf"} · max {fp?.maxFileSize || 1}{fp?.maxFileSizeUnit || "mb"}
                {fp?.multiple && " · multiple allowed"}
              </p>
            </div>
            <input
              type="file"
              accept={fp?.format || ".pdf"}
              multiple={fp?.multiple}
              className="sr-only"
              onChange={(e) => onChange(fp?.multiple ? Array.from(e.target.files) : [e.target.files[0]])}
            />
          </label>
          {files.length > 0 && (
            <div className="mt-3 space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-slate-300 text-sm truncate">{f.name}</span>
                  <button type="button" onClick={() => onChange(files.filter((_, idx) => idx !== i))} className="ml-auto text-slate-500 hover:text-red-400 text-xs shrink-0">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return <p className="text-slate-400 text-sm">Unsupported question type: {question.type}</p>;
  }
}

// ── Review page ───────────────────────────────────────────────────────────────

function ReviewPage({ questions, answers }) {
  return (
    <div className="space-y-4">
      {questions.map((q, i) => {
        const value = answers[q.name];
        let display = "—";
        if (q.type === "file" && Array.isArray(value) && value.length) {
          display = value.map((f) => f.name).join(", ");
        } else if (Array.isArray(value)) {
          display = value.join(", ") || "—";
        } else if (value) {
          display = value;
        }
        return (
          <div key={q.id || i} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">Q{i + 1} · {q.text}</p>
            <p className="text-white font-medium break-words">{display}</p>
          </div>
        );
      })}
    </div>
  );
}

// Main SurveyForm 
export default function SurveyForm({ survey, navigate }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0); // 0..n-1 = questions, n = review
  const [answers, setAnswers] = useState({});
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setQuestions(await fetchQuestions(survey.id));
  //     } catch (e) {
  //       setError("Could not load survey questions.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, [survey?.id]);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchQuestions(survey.id);

        const normalized = data
          // .filter((q) => {
          //   // Skip choice questions that have no options (broken/incomplete)
          //   const needsOptions = [ "single_choice", "multiple_choice"].includes(q.type);
          //   return !needsOptions || q.options.length > 0;
          // })
          .map((q) => {
            if (q.type === "choice") {
              q.type = q.multiple ? "multiple_choice" : "single_choice";
            }
            return q;
          });

        setQuestions(normalized);
      } catch (e) {
        setError("Could not load survey questions.");
      } finally {
        setLoading(false);
      }
    })();
  }, [survey?.id]);
  const isReview = step === questions.length;
  const currentQ = questions[step];
  const progress = questions.length > 0 ? ((step) / questions.length) * 100 : 0;

  const validate = () => {
    if (!currentQ) return true;
    const val = answers[currentQ.name];
    if (!currentQ.required) return true;
    if (currentQ.type === "file") return Array.isArray(val) && val.length > 0;
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== "";
  };

  const next = () => {
    if (!validate()) {
      setValidationError("This question is required. Please provide an answer.");
      return;
    }
    setValidationError("");
    setStep((s) => s + 1);
  };

  const prev = () => {
    setValidationError("");
    setStep((s) => s - 1);
  };

  // const handleSubmit = async () => {
  //   setSubmitting(true);
  //   try {
  //     const fd = new FormData();
  //     const xmlParts = [];

  //     questions.forEach((q) => {
  //       const val = answers[q.name];
  //       if (q.type === "file") {
  //         if (Array.isArray(val)) val.forEach((f) => fd.append("certificates", f));
  //       } else {
  //         const textVal = Array.isArray(val) ? val.join(",") : (val || "");
  //         xmlParts.push(`<${q.name}>${textVal}</${q.name}>`);
  //       }
  //     });

  //     const xml = `<question_response>${xmlParts.join("")}</question_response>`;
  //     fd.append("data", new Blob([xml], { type: "application/xml" }));

  //     await submitResponse(survey.id, fd);
  //     setSubmitted(true);
  //   } catch (e) {
  //     setValidationError("Submission failed. Please try again.");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
  setSubmitting(true);
  try {
    const fd = new FormData();

    questions.forEach((q) => {
      const val = answers[q.name];

      if (q.type === "file") {
        // files go as their own fieldname (matching q.name)
        if (Array.isArray(val)) {
          val.forEach((f) => fd.append(q.name, f));
        }
      } else if (q.type === "multiple_choice") {
        // multiple values under the same field name
        const vals = Array.isArray(val) ? val : val ? [val] : [];
        vals.forEach((v) => fd.append(q.name, v));
      } else {
        // text, email, long_text, single_choice, etc.
        fd.append(q.name, val ?? "");
      }
    });

    await submitResponse(survey.id, fd);
    setSubmitted(true);
  } catch (e) {
    setValidationError("Submission failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#0F1B2D] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Response Submitted!</h2>
          <p className="text-slate-400 mb-8">Thank you for completing <strong className="text-slate-200">{survey.name}</strong>.</p>
          <button onClick={() => navigate("available")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#0F1B2D]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("available")}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/40 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold truncate">{survey.name}</h1>
            <p className="text-slate-400 text-xs">{survey.description}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p>Loading questions…</p>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{isReview ? "Review" : `Question ${step + 1} of ${questions.length}`}</span>
                <span>{isReview ? "Final step" : `${Math.round(progress)}% complete`}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${isReview ? 100 : progress}%` }} />
              </div>
            </div>

            {/* Step dots */}
            {questions.length <= 12 && (
              <div className="flex gap-1.5 justify-center mb-8">
                {questions.map((_, i) => (
                  <div key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? "bg-blue-500 w-4" : i === step ? "bg-blue-400 w-6" : "bg-white/20 w-1.5"
                      }`} />
                ))}
                <div className={`h-1.5 rounded-full transition-all duration-300 ${isReview ? "bg-blue-400 w-6" : "bg-white/20 w-1.5"
                  }`} />
              </div>
            )}

            {/* Question / Review */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-4">
              {isReview ? (
                <>
                  <h2 className="text-white font-bold text-xl mb-1">Review your answers</h2>
                  <p className="text-slate-400 text-sm mb-6">Please check your responses before submitting.</p>
                  <ReviewPage questions={questions} answers={answers} />
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-blue-400 font-bold text-sm mt-0.5">{step + 1}.</span>
                    <div>
                      <h2 className="text-white font-semibold text-xl leading-snug">
                        {currentQ.text}
                        {currentQ.required && <span className="text-red-400 ml-1">*</span>}
                      </h2>
                      {currentQ.description && (
                        <p className="text-slate-400 text-sm mt-1">{currentQ.description}</p>
                      )}
                    </div>
                  </div>
                  <QuestionInput
                    question={currentQ}
                    value={answers[currentQ.name]}
                    onChange={(v) => {
                      setAnswers((a) => ({ ...a, [currentQ.name]: v }));
                      setValidationError("");
                    }}
                  />
                  {validationError && (
                    <p className="mt-3 text-sm text-red-400">{validationError}</p>
                  )}
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={prev}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:border-white/40 hover:text-white transition-colors font-medium text-sm">
                  ← Previous
                </button>
              )}
              <div className="flex-1" />
              {isReview ? (
                <button onClick={handleSubmit} disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-60 text-sm flex items-center gap-2">
                  {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {submitting ? "Submitting…" : "Submit Response"}
                </button>
              ) : (
                <button onClick={next}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm">
                  {step === questions.length - 1 ? "Review →" : "Next →"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}