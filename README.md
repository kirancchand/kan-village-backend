# VillageApp PostgreSQL Backend

## Install

```bash
npm install
```

## Configure

Update `.env`

## Run

```bash
npm run dev
```

## Database Setup

Run:

```bash
psql -U postgres
```

Then:

```sql
CREATE DATABASE villageapp;
```

Then run:

```bash
psql -U postgres -d villageapp -f database.sql
```

## APIs

### Village App

GET `/api/villageapps`

POST `/api/villageapps`

```json
{
  "villageapp_name":"My Village",
  "villageapp_desc":"Village app",
  "villageapp_about":"About village"
}
```

### Users

GET `/api/users`

POST `/api/users`

### Organisations

GET `/api/organisations`

POST `/api/organisations`

### Advertisements

GET `/api/advertisements`

POST `/api/advertisements`