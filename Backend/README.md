# StockMarket API

Backend service that aggregates social and trend signals for stock-market style insights.
It exposes an Express API, caches X (Twitter) lookups in MongoDB, and can store Google Trends
time-series data for keywords.

## Highlights

- Express server with modular routers.
- X API integration with cache-backed user and tweet lookups.
- Google Trends ingestion with bulk upserts.
- MongoDB via Mongoose for persistence and caching.

## API

Base URL: `http://localhost:3000/api`

- `GET /` -> health check
- `GET /x/user/:username` -> fetch X user profile by username (cached)
- `GET /x/user/:username/tweets` -> fetch latest tweets for a user (cached, TTL 15 min)
- `GET /trends/:keyword` -> fetch and store Google Trends interest over time

## Setup

1) Install dependencies
```
npm install
```

2) Create environment variables
- `MONGO_URI` (MongoDB connection string)
- `X_BEARER_TOKEN` (X API bearer token)

3) Run the server
```
npm start
```

## Project Structure

```
.
├── Server.js                         # Express app entrypoint
├── package.json                      # Scripts and dependencies
├── package-lock.json                 # Dependency lockfile
├── .env                              # Local environment variables (do not commit)
├── .env.local                        # Local overrides (do not commit)
├── StepByStep_X.md                   # Notes and steps for X integration
├── TheSource.md                      # Project notes
└── Src
    ├── Controller                    # Placeholder for local controllers
    ├── Service                       # Placeholder for local services
    ├── Router
    │   └── index.js                  # API routes and wiring
    ├── Data
    │   ├── DB.js                     # MongoDB connection
    │   └── Model
    │       ├── X_UserCache.js        # Cached X user profiles
    │       └── X_TweetCache.js       # Cached X tweets (TTL-based)
    ├── ThirdParty
    │   └── APIs
    │       ├── GoogleTrends
    │       │   ├── Controller
    │       │   │   └── googleTrends.js  # Request handler for trends ingestion
    │       │   ├── Model
    │       │   │   └── googleTrends.js  # TrendSignal schema
    │       │   └── Service
    │       │       └── googleTrends.js  # Google Trends API wrapper
    │       └── X
    │           ├── X_API.js          # Axios client for X API
    │           ├── userRouter.js     # X API routes
    │           ├── userNameService.js# X username lookup + cache
    │           └── tweetService.js   # X tweet lookup + cache
    └── Utils
        └── retry.js                  # Generic retry helper (429 backoff)
```

## Notes

- MongoDB is required; the app exits if the connection fails.
- X API responses are cached in MongoDB to reduce rate-limit pressure.
- Google Trends writes are upserted by keyword, geo, and timestamp.
