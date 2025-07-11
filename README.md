# Task Manager Application

A Next.js application for managing tasks with AI-powered task generation using Gemini API.

## Features

- User authentication with Clerk
- Task management (create, read, update, delete)
- AI-powered task generation with Google Gemini
- PostgreSQL database with Drizzle ORM

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```
# Database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"

# Clerk authentication
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

#### Getting API Keys:

- **Clerk API Keys**: Sign up at [clerk.dev](https://clerk.dev) and create a new application to get your API keys.
- **Gemini API Key**: Get your API key from [Google AI Studio](https://ai.google.dev/).

### 4. Set up the database

```bash
# Create database migrations
npx drizzle-kit generate

# Run migrations
npx drizzle-kit push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

| Variable                            | Description                                  | Required             |
| ----------------------------------- | -------------------------------------------- | -------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string                 | Yes                  |
| `CLERK_SECRET_KEY`                  | Clerk secret key for authentication          | Yes                  |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication     | Yes                  |
| `GEMINI_API_KEY`                    | Google Gemini API key for AI task generation | Yes, for AI features |

## Troubleshooting

If you encounter any issues:

1. Check the Configuration Status page in the application for any missing environment variables.
2. Ensure your API keys are valid and have the correct permissions.
3. For Gemini API rate limit errors, ensure you're not exceeding the free tier limits.
4. Restart the application after making changes to environment variables.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   t a s k - m a n a g e r  
 