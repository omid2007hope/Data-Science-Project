Full-stack app that pulls X (Twitter) user tweets, stores them in MongoDB, and can run OpenAI-based analysis. The frontend is a Vite + React UI that triggers the backend API.

## Features

- Fetch X user profile by username and cache it in MongoDB.
- Fetch recent tweets for a user and cache them in MongoDB.
- Analyze stored tweets with OpenAI and store summaries/keywords.
- React UI to submit a username search.

## Tech Stack

- Backend: Node.js, Express, Mongoose, Axios
- Database: MongoDB
- External APIs: X API, OpenAI API
- Frontend: React, Vite, Tailwind CSS

## Monorepo Layout

```
.
├── Backend
│   ├── Server.js
│   └── Src
│       ├── Controller
│       ├── Service
│       ├── Router
│       ├── Data
│       ├── Model
│       └── ThirdParty
└── frontend
    ├── src
    └── index.html
```

## Backend Setup

1) Install dependencies

```bash
cd Backend
npm install
```

2) Create a `.env` file in `Backend`:

```
MONGO_URI=your_mongodb_connection_string
X_BEARER_TOKEN=your_x_api_bearer_token
OPENAI_API_KEY=your_openai_api_key
```

3) Start the server

```bash
npm start
```

The server listens on `http://localhost:3000`.

### Backend API

Base URL: `http://localhost:3000/api`

- `GET /` health check
- `GET /x/user/:username` fetch user and cached tweets
- `POST /ai/tweet/analyze` analyze tweets stored in MongoDB

## Frontend Setup

1) Install dependencies

```bash
cd frontend
npm install
```

2) Optional environment variable:

Create `frontend/.env` if the API is not on localhost.

```
VITE_API_URL=http://localhost:3000
```

3) Start the dev server

```bash
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

## Notes

- MongoDB must be running before starting the backend.
- The OpenAI analysis endpoint reads tweets already stored in MongoDB.
- The frontend currently sends a request to the backend when searching a username.

