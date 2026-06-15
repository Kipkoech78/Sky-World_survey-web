# Sky World Surveys — Frontend

A dynamic survey form application built with React and Vite. It allows respondents to browse available surveys, answer questions of various types (text, email, single choice, multiple choice, file upload), review their answers, and submit responses to a REST API backend.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- The [Sky World Surveys API](https://github.com/Kipkoech78/sky-world) backend running locally or accessible via a URL

---

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Kipkoech78/Sky-World_survey-web.git
   cd sky-world-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and set the API base URL:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

---

## Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## Technologies Used

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI component library |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [xmlbuilder2](https://oozcitak.github.io/xmlbuilder2/) | XML parsing for API responses |
| Fetch API | HTTP communication with the backend |

---

## Assumptions Made

- The backend API returns and accepts **XML** (`application/xml`) for all survey and question endpoints, and **multipart/form-data** for response submissions.
- Question `name` attributes from the API may contain spaces or special characters; these are sanitized client-side before use.
- File upload questions only accept **PDF** files, enforced by both the frontend input filter and the backend multer config.
- A `choice` question with `multiple="yes"` is treated as a multiple-choice (checkbox) question; without it, it is treated as single-choice (radio).
- Questions of type `choice` that have no options in the API response are filtered out and not shown to the respondent.
- The API base URL defaults to `http://localhost:3000/api` if the `VITE_API_BASE_URL` environment variable is not set.
- Survey responses are submitted one question at a time through a stepped form UI with a final review screen before submission.