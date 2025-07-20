import { useAppStoreContext } from '../lib/useAppStore';
import AddQuestionForm from '../components/AddQuestionForm';
import QuestionCard from '../components/QuestionCard';
import type { Question } from '../types/models';
import { useState } from 'react';

function HomePage() {
    const { questions, setQuestions, user, users, answers } = useAppStoreContext();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const handleAddQuestion = (text: string, description: string) => {
        if (!user) return;
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            text,
            description,
            userId: user.id,
            createdAt: new Date().toISOString(),
            votes: { up: 0, down: 0 },
        };
        setQuestions([newQuestion, ...questions]);
    };

    const handleVote = (id: string, type: 'up' | 'down') => {
        setQuestions(
            questions.map(q =>
                q.id === id
                    ? {
                        ...q,
                        votes: {
                            ...q.votes,
                            [type]: q.votes[type] + 1,
                        },
                    }
                    : q
            )
        );
    };

    const handleEdit = (q: Question) => {
        setEditingId(q.id);
        setEditText(q.text);
    };

    const handleEditSave = (id: string) => {
        setQuestions(
            questions.map(q =>
                q.id === id ? { ...q, text: editText } : q
            )
        );
        setEditingId(null);
        setEditText('');
    };

    const handleDelete = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">What do you want to ask?</h2>
            <div className="mb-8">
                <AddQuestionForm onAdd={handleAddQuestion} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Questions</h2>
            <div className="space-y-4">
                {questions.length === 0 ? (
                    <p className="text-gray-500">No questions yet. Be the first to ask!</p>
                ) : (
                    questions.map((q) => {
                        const answerCount = answers.filter(a => a.questionId === q.id).length;
                        const author = users.find(u => u.id === q.userId);
                        const authorName = author?.name || 'Anonymous';
                        const date = new Date(q.createdAt);
                        const createdAt = date.toLocaleString();
                        return editingId === q.id ? (
                            <div key={q.id} className="bg-card border border-border rounded-lg shadow-sm p-5 flex items-center gap-4 transition-colors">
                                <input
                                    className="flex-1 p-2 rounded bg-background text-foreground border border-border focus:ring-2 focus:ring-accent"
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                />
                                <button
                                    className="px-3 py-1 rounded bg-accent text-accent-foreground font-semibold shadow hover:bg-accent/80 focus-visible:bg-accent/90 transition-all text-xs"
                                    onClick={() => handleEditSave(q.id)}
                                    disabled={!editText.trim()}
                                >
                                    Save
                                </button>
                                <button
                                    className="px-3 py-1 rounded bg-muted text-foreground font-semibold shadow hover:bg-muted/80 focus-visible:bg-muted/90 transition-all text-xs"
                                    onClick={() => setEditingId(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <QuestionCard
                                key={q.id}
                                question={q}
                                onVote={type => handleVote(q.id, type)}
                                onEdit={user && q.userId === user.id ? () => handleEdit(q) : undefined}
                                onDelete={user && q.userId === user.id ? () => handleDelete(q.id) : undefined}
                                answerCount={answerCount}
                                authorName={authorName}
                                createdAt={createdAt}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default HomePage; 