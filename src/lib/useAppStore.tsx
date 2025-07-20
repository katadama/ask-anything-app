import { useState, useEffect, createContext, useContext } from 'react';
import type { User, Question, Answer } from '../types/models';
import type { ReactNode } from 'react';
import {
    getUser,
    setUser,
    getUsers,
    setUsers,
    getQuestions,
    setQuestions,
    getAnswers,
    setAnswers,
} from './localStorage';

function generateUUID() {
    // Simple UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const DEFAULT_NAME = 'Anonymous';

// Store shape
interface AppStore {
    user: User | null;
    setUser: (user: User) => void;
    users: User[];
    setUsers: (users: User[]) => void;
    questions: Question[];
    setQuestions: (questions: Question[]) => void;
    answers: Answer[];
    setAnswers: (answers: Answer[]) => void;
}

const AppStoreContext = createContext<AppStore | undefined>(undefined);

export function AppStoreProvider({ children }: { children: ReactNode }) {
    const store = useAppStore();
    return <AppStoreContext.Provider value={store}> {children} </AppStoreContext.Provider>;
}

export function useAppStoreContext() {
    const ctx = useContext(AppStoreContext);
    if (!ctx) throw new Error('useAppStoreContext must be used within AppStoreProvider');
    return ctx;
}

export function useAppStore() {
    // User state
    const [user, setUserState] = useState<User | null>(null);
    const [users, setUsersState] = useState<User[]>([]);
    // Questions state
    const [questions, setQuestionsState] = useState<Question[]>([]);
    // Answers state
    const [answers, setAnswersState] = useState<Answer[]>([]);

    // On mount: load from localStorage, initialize user if needed
    useEffect(() => {
        let storedUser = getUser();
        let storedUsers = getUsers();
        if (!storedUser) {
            storedUser = { id: generateUUID(), name: DEFAULT_NAME, votedQuestions: {}, votedAnswers: {} };
            setUser(storedUser);
            storedUsers = [storedUser];
            setUsers(storedUsers);
        }
        setUserState({
            ...storedUser,
            votedQuestions: storedUser.votedQuestions || {},
            votedAnswers: storedUser.votedAnswers || {},
        });
        setUsersState(storedUsers);
        setQuestionsState(getQuestions());
        setAnswersState(getAnswers());
    }, []);

    // Sync user to localStorage and users list
    const updateUser = (newUser: User) => {
        setUserState(newUser);
        setUser(newUser);
        setUsersState(prev => {
            const exists = prev.some(u => u.id === newUser.id);
            const updated = exists
                ? prev.map(u => u.id === newUser.id ? newUser : u)
                : [...prev, newUser];
            setUsers(updated);
            return updated;
        });
    };

    const updateUsers = (newUsers: User[]) => {
        setUsersState(newUsers);
        setUsers(newUsers);
    };

    // Sync questions to localStorage
    const updateQuestions = (newQuestions: Question[]) => {
        setQuestionsState(newQuestions);
        setQuestions(newQuestions);
    };

    // Sync answers to localStorage
    const updateAnswers = (newAnswers: Answer[]) => {
        setAnswersState(newAnswers);
        setAnswers(newAnswers);
    };

    return {
        user,
        setUser: updateUser,
        users,
        setUsers: updateUsers,
        questions,
        setQuestions: updateQuestions,
        answers,
        setAnswers: updateAnswers,
    };
} 