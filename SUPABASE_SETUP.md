# Supabase Setup

Run the following SQL in your Supabase project's **SQL Editor** to create the `players` table and enable real-time sync.

## 1. Create the table

```sql
CREATE TABLE players (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  location_id TEXT    NOT NULL,
  player_number INT  NOT NULL,
  name       TEXT    NOT NULL,
  contact    TEXT    NOT NULL,
  age        INT     NOT NULL,
  score      INT,
  layout     JSONB   DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  score_timestamp TIMESTAMPTZ,
  game_date  DATE    DEFAULT CURRENT_DATE
);

CREATE INDEX idx_players_location_date
  ON players (location_id, game_date);
```

## 2. Enable Row-Level Security (public access)

```sql
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access"
  ON players FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Enable Realtime

In the Supabase dashboard go to **Database → Replication** and make sure the `players` table is added to the `supabase_realtime` publication. Or run:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE players;
```

## 4. Environment variables

Set these in **Netlify → Site settings → Environment variables** (they are already referenced in the app):

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase project anon/public key |

For local development create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```
