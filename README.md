# ASK*ANYTHING*

A modern, dark-themed, fully client-side Q&A platform built AI tools and with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui. Users can anonymously post questions, answer, vote, and manage their profile—all data is stored in localStorage.

## Features

- **Anonymous Q&A:** Post and answer questions without registration.
- **Voting:** Upvote/downvote questions and answers, with glowing visual feedback.
- **Profile Management:** Change your display name, abandon your profile to start fresh.
- **Persistence:** All data (users, questions, answers, votes) is stored in localStorage.
- **Dark Theme:** Modern neon-inspired dark UI using Tailwind and shadcn/ui.
- **Author Attribution:** Author names are preserved even if a user abandons their profile.

## Tech Stack

- **React + Vite** – Fast, modern frontend framework and tooling
- **TypeScript** – Type safety
- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Component library for beautiful dark UI
- **localStorage** – Data persistence (no backend)

## Project Structure

```
src/
  components/      # UI components (cards, forms, header)
  pages/           # Main pages (Home, Question, Profile)
  lib/             # State management, localStorage helpers
  types/           # TypeScript models
  assets/          # Static assets
  App.tsx          # App root
  main.tsx         # Entry point
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repo-url>
cd <repo-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **Ask a Question:** Use the form on the homepage.
- **Answer a Question:** Click a question, use the answer form.
- **Vote:** Click the up/down arrows on questions/answers.
- **Edit/Delete:** You can edit or delete your own questions/answers.
- **Profile:** Change your display name or abandon your profile (creates a new anonymous user).
- **Persistence:** All data is stored in your browser. Use incognito/private mode to simulate a new user.

## Development Notes

- **Data Model:**
  - User: `{ id, name, votedQuestions, votedAnswers }`
  - Question: `{ id, text, description, userId, createdAt, votes }`
  - Answer: `{ id, questionId, text, userId, createdAt, votes }`
- **Author Attribution:**
  - The app keeps a list of all users ever created. Author names are preserved for all questions/answers, even if a user abandons their profile.
- **Dark Theme:**
  - The app is always in dark mode, styled with Tailwind and shadcn/ui.
- **LocalStorage:**
  - To reset all data, clear localStorage in your browser dev tools.
