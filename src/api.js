const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ── XML helpers ──────────────────────────────────────────────────────────────

function parseXML(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");

  const error = doc.querySelector("parsererror");
  if (error) {
    console.error("XML PARSE ERROR:", error.textContent);
  }

  return doc;
}

function xmlToText(node) {
  return node ? node.textContent.trim() : "";
}

function attr(el, name) {
  return el ? el.getAttribute(name) : null;
}

// ── Survey parsers ────────────────────────────────────────────────────────────

function parseSurveys(xml) {
  const doc = parseXML(xml);
  return Array.from(doc.querySelectorAll("survey")).map((s) => ({
    id: attr(s, "id"),
    name: xmlToText(s.querySelector("name")),
    description: xmlToText(s.querySelector("description")),
  }));
}

// function parseQuestions(xml) {
//   const doc = parseXML(xml);
//   return Array.from(doc.querySelectorAll("question")).map((q) => {
//     const options = Array.from(q.querySelectorAll("option")).map((o) => ({
//       value: attr(o, "value"),
//       label: o.textContent.trim(),
//     }));
//     const fp = q.querySelector("file_properties");
//     return {
//       id: attr(q, "id"),
//       name: attr(q, "name"),
//       type: attr(q, "type"),
//       required: attr(q, "required") === "yes",
//       text: xmlToText(q.querySelector("text")),
//       description: xmlToText(q.querySelector("description")),
//       multiple: attr(q.querySelector("options"), "multiple") === "yes",
//       options,
//       fileProperties: fp
//         ? {
//             format: attr(fp, "format"),
//             maxFileSize: attr(fp, "max_file_size"),
//             maxFileSizeUnit: attr(fp, "max_file_size_unit"),
//             multiple: attr(fp, "multiple") === "yes",
//           }
//         : null,
//     };
//   });
// }
function parseQuestions(xml) {
  const doc = parseXML(xml);

  return Array.from(doc.getElementsByTagName("question")).map((q) => {
   // const optionsNode = q.getElementsByTagName("options")[0];

   const optionsNode = Array.from(q.children).find(
  (child) => child.tagName === "options"
);
    const options = optionsNode
  ? Array.from(optionsNode.children)
      .filter((n) => n.tagName === "option")
      .map((o) => ({
        value: o.getAttribute("value"),
        label: o.textContent.trim(),
      }))
  : [];
    console.log("Options", options)
    console.log(xml);
    console.log("Doc", doc);
    console.log("Questions", doc.getElementsByTagName("question"));

    const fp = q.getElementsByTagName("file_properties")[0];

    return {
      id: q.getAttribute("id"),
      name: q.getAttribute("name"),
      type: q.getAttribute("type"),
      required: q.getAttribute("required") === "yes",
      text: xmlToText(q.getElementsByTagName("text")[0]),
      description: xmlToText(q.getElementsByTagName("description")[0]),
      multiple: optionsNode?.getAttribute("multiple") === "yes",
      options,
      fileProperties: fp
        ? {
          format: fp.getAttribute("format"),
          maxFileSize: fp.getAttribute("max_file_size"),
          maxFileSizeUnit: fp.getAttribute("max_file_size_unit"),
          multiple: fp.getAttribute("multiple") === "yes",
        }
        : null,
    };
  });
}

function parseResponses(xml) {
  const doc = parseXML(xml);
  const root = doc.querySelector("question_responses");
  const responses = Array.from(doc.querySelectorAll("question_response")).map((r) => {
    const certs = Array.from(r.querySelectorAll("certificate")).map((c) => ({
      id: attr(c, "id"),
      name: c.textContent.trim(),
    }));
    return {
      responseId: xmlToText(r.querySelector("response_id")),
      fullName: xmlToText(r.querySelector("full_name")),
      emailAddress: xmlToText(r.querySelector("email_address")),
      gender: xmlToText(r.querySelector("gender")),
      description: xmlToText(r.querySelector("description")),
      programmingStack: xmlToText(r.querySelector("programming_stack")),
      dateResponded: xmlToText(r.querySelector("date_responded")),
      certificates: certs,
    };
  });
  return {
    currentPage: root ? parseInt(attr(root, "current_page")) : 1,
    lastPage: root ? parseInt(attr(root, "last_page")) : 1,
    pageSize: root ? parseInt(attr(root, "page_size")) : 10,
    totalCount: root ? parseInt(attr(root, "total_count")) : 0,
    responses,
  };
}

// ── XML builders ──────────────────────────────────────────────────────────────

function surveyToXML({ name, description }) {
  return `<survey><name>${name}</name><description>${description}</description></survey>`;
}

function questionToXML(q) {
  const optionsXML =
    q.options && q.options.length
      ? `<options multiple="${q.multiple ? "yes" : "no"}">${q.options
        .map((o) => `<option value="${o.value}">${o.label}</option>`)
        .join("")}</options>`
      : "";
  const fileXML =
    q.type === "file"
      ? `<file_properties format="${q.fileFormat || ".pdf"}" max_file_size="${q.maxFileSize || "1"}" max_file_size_unit="${q.maxFileSizeUnit || "mb"}" multiple="${q.multiple ? "yes" : "no"}"/>`
      : "";
  return `<question name="${q.name}" type="${q.type}" required="${q.required ? "yes" : "no"}"><text>${q.text}</text><description>${q.description || ""}</description>${optionsXML}${fileXML}</question>`;
}

// ── API calls 
async function request(method, path, body = null, isFormData = false) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/xml";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body || undefined,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text;
}

// Surveys
export async function fetchSurveys() {
  const xml = await request("GET", "/surveys");
  return parseSurveys(xml);
}

export async function createSurvey(data) {
  await request("POST", "/surveys", surveyToXML(data));
}

export async function updateSurvey(id, data) {
  await request("PUT", `/surveys/${id}`, surveyToXML(data));
}

export async function deleteSurvey(id) {
  await request("DELETE", `/surveys/${id}`);
}

// Questions
export async function fetchQuestions(surveyId) {
  const xml = await request("GET", `/surveys/${surveyId}/questions`);
  return parseQuestions(xml);
}

export async function createQuestion(surveyId, data) {
  await request("POST", `/surveys/${surveyId}/questions`, questionToXML(data));
}

export async function updateQuestion(surveyId, questionId, data) {
  await request("PUT", `/surveys/${surveyId}/questions/${questionId}`, questionToXML(data));
}

export async function deleteQuestion(surveyId, questionId) {
  await request("DELETE", `/surveys/${surveyId}/questions/${questionId}`);
}

// Responses
export async function fetchResponses(surveyId, { page = 1, pageSize = 10, email = "" } = {}) {
  const params = new URLSearchParams({ page, pageSize });
  if (email) params.set("email", email);
  const xml = await request("GET", `/surveys/${surveyId}/responses?${params}`);
  return parseResponses(xml);
}

export async function submitResponse(surveyId, formData) {
  const res = await fetch(`${BASE_URL}/surveys/${surveyId}/responses`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export function getCertificateUrl(id) {
  return `${BASE_URL}/certificates/${id}`;
}