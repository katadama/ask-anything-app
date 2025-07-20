// User interface
export interface User {
    id: string; // anonymous, stored in localStorage
    name: string; // editable display name
    votedQuestions?: Record<string, 'up' | 'down'>;
    votedAnswers: Record<string, 'up' | 'down'>;
}

// Question interface
export interface Question {
    id: string;
    text: string;
    description?: string; // markdown-capable
    userId: string;
    createdAt: string;
    votes: { up: number; down: number };
}

// Answer interface
export interface Answer {
    id: string;
    questionId: string;
    text: string;
    userId: string;
    createdAt: string;
    votes: { up: number; down: number };
} 