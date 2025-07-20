import { useParams } from 'react-router-dom';
import { useAppStoreContext } from '../lib/useAppStore';
import AddAnswerForm from '../components/AddAnswerForm';
import AnswerCard from '../components/AnswerCard';
import type { Answer } from '../types/models';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function QuestionPage() {
    const { id } = useParams<{ id: string }>();
    const { questions, setQuestions, answers, setAnswers, user, setUser, users } = useAppStoreContext();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

    const question = questions.find(q => q.id === id);
    const questionAnswers = answers.filter(a => a.questionId === id);

    useEffect(() => {
        if (user && question) {
            setUserVote(user.votedQuestions?.[question.id] || null);
        }
    }, [user, question]);

    const handleAddAnswer = (text: string) => {
        if (!user || !question) return;
        const newAnswer: Answer = {
            id: crypto.randomUUID(),
            questionId: question.id,
            text,
            userId: user.id,
            createdAt: new Date().toISOString(),
            votes: { up: 0, down: 0 },
        };
        setAnswers([newAnswer, ...answers]);
    };

    const handleVote = (id: string, type: 'up' | 'down') => {
        setAnswers(
            answers.map(a =>
                a.id === id
                    ? {
                        ...a,
                        votes: {
                            ...a.votes,
                            [type]: a.votes[type] + 1,
                        },
                    }
                    : a
            )
        );
    };

    const handleEdit = (a: Answer) => {
        setEditingId(a.id);
        setEditText(a.text);
    };

    const handleEditSave = (id: string) => {
        setAnswers(
            answers.map(a =>
                a.id === id ? { ...a, text: editText } : a
            )
        );
        setEditingId(null);
        setEditText('');
    };

    const handleDelete = (id: string) => {
        setAnswers(answers.filter(a => a.id !== id));
    };

    const handleQuestionVote = (type: 'up' | 'down') => {
        if (!user || !question) return;
        let prevVote = user.votedQuestions?.[question.id] || null;
        let upDelta = 0, downDelta = 0;
        let newVotedQuestions = { ...user.votedQuestions };
        if (prevVote === type) {
            // Unvote
            upDelta = type === 'up' ? -1 : 0;
            downDelta = type === 'down' ? -1 : 0;
            setUserVote(null);
            delete newVotedQuestions[question.id];
            setUser({
                ...user,
                votedQuestions: newVotedQuestions,
            });
        } else {
            // Change or new vote
            if (prevVote === 'up') upDelta = -1;
            if (prevVote === 'down') downDelta = -1;
            if (type === 'up') upDelta += 1;
            if (type === 'down') downDelta += 1;
            setUserVote(type);
            newVotedQuestions[question.id] = type;
            setUser({
                ...user,
                votedQuestions: newVotedQuestions,
            });
        }
        setQuestions(
            questions.map(q =>
                q.id === id
                    ? {
                        ...q,
                        votes: {
                            up: q.votes.up + upDelta,
                            down: q.votes.down + downDelta,
                        },
                    }
                    : q
            )
        );
    };

    if (!question) {
        return (
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">Question Not Found</h2>
                <p>The question you are looking for does not exist.</p>
            </div>
        );
    }

    const author = users.find(u => u.id === question.userId);
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-start gap-6">
                <div className="flex flex-col items-center gap-1">
                    <button
                        className={`text-green-400 text-3xl transition-all px-2 py-1 rounded ${userVote === 'up' ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] bg-green-900/30' : 'hover:text-green-300'}`}
                        onClick={() => handleQuestionVote('up')}
                        aria-label="Upvote question"
                    >
                        ▲<br />
                        <span className="text-base font-bold">{question.votes.up}</span>
                    </button>
                    <button
                        className={`text-red-400 text-3xl transition-all px-2 py-1 rounded ${userVote === 'down' ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] bg-red-900/30' : 'hover:text-red-300'}`}
                        onClick={() => handleQuestionVote('down')}
                        aria-label="Downvote question"
                    >
                        ▼<br />
                        <span className="text-base font-bold">{question.votes.down}</span>
                    </button>
                </div>
                <div className="w-0 flex-1">
                    <h2 className="text-2xl font-bold mb-2 break-words w-full">{question.text}</h2>

                    {question.description && (
                        <div className="prose prose-invert break-words w-full mb-4">
                            <ReactMarkdown>{question.description}</ReactMarkdown>
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground mb-2">By: <span className="font-medium text-foreground">{author?.name || 'Anonymous'}</span></div>
                </div>
            </div>
            <div className="mb-8">
                <AddAnswerForm onAdd={handleAddAnswer} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Answers</h3>
            <div className="space-y-4">
                {questionAnswers.length === 0 ? (
                    <p className="text-gray-500">No answers yet. Be the first to answer!</p>
                ) : (
                    questionAnswers.map(a => (
                        editingId === a.id ? (
                            <div key={a.id} className="bg-card border border-border rounded-lg shadow-sm p-5 flex items-center gap-4 transition-colors">
                                <input
                                    className="flex-1 p-2 rounded bg-background text-foreground border border-border focus:ring-2 focus:ring-accent"
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                />
                                <button
                                    className="px-3 py-1 rounded bg-accent text-accent-foreground font-semibold shadow hover:bg-accent/80 focus-visible:bg-accent/90 transition-all text-xs"
                                    onClick={() => handleEditSave(a.id)}
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
                            <AnswerCard
                                key={a.id}
                                answer={a}
                                onEdit={user && a.userId === user.id ? () => handleEdit(a) : undefined}
                                onDelete={user && a.userId === user.id ? () => handleDelete(a.id) : undefined}
                            />
                        )
                    ))
                )}
            </div>
        </div>
    );
}

export default QuestionPage; 