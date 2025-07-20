import type { User, Question, Answer } from '../types/models';

const USER_KEY = 'user';
const USERS_KEY = 'users';
const QUESTIONS_KEY = 'questions';
const ANSWERS_KEY = 'answers';

export function getUser(): User | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

export function setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
}

export function setUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getQuestions(): Question[] {
    const data = localStorage.getItem(QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
}

export function setQuestions(questions: Question[]) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
}

export function getAnswers(): Answer[] {
    const data = localStorage.getItem(ANSWERS_KEY);
    return data ? JSON.parse(data) : [];
}

export function setAnswers(answers: Answer[]) {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
} 