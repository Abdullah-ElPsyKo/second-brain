# Backend

Express API using TypeScript, Prisma, and SQLite.

## Start locally

1. Install dependencies with `npm install`.
2. Start the API with `npm run dev`.

The API listens on port `3000`. The local SQLite database is stored at `prisma/dev.db` and is ignored by Git.

When you change `prisma/schema.prisma`, create and apply a migration with:

```shell
npm run db:migrate -- --name describe_your_change
```

Open the database in Prisma Studio with `npm run db:studio`.

## Layout

- `src/routes/`: route modules
- `src/controllers/`: request and response handling
- `src/services/`: application logic
- `src/db/`: Prisma client
- `prisma/`: database schema and migrations
