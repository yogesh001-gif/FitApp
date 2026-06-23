# Fitapp

Production-ready AI fitness SaaS scaffold built with Next.js, TypeScript, Tailwind CSS, Clerk, MongoDB/Mongoose, Gemini, and Cloudinary.

## What is included

- Clerk auth wiring and protected routes
- Onboarding flow and dashboard shell
- Dynamic BMI, BMR, TDEE, and nutrition target calculations
- AI food analysis, diet plans, workout plans, and coach endpoints
- Mongoose models for users, logs, plans, progress, water, photos, and chat history
- Responsive dark-mode UI primitives and dashboard components

## Setup

1. Copy `.env.example` to `.env.local` and fill in credentials.
2. Install dependencies with `npm install`.
3. Run the app with `npm run dev`.

## Notes

- Nutrition targets are calculated from user profile data and goal logic.
- AI outputs are validated before persistence.
- Every authenticated user is designed to have a database record.
