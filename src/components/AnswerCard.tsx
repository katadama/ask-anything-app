import type { Answer } from '../types/models';
import { useAppStoreContext } from '../lib/useAppStore';
import { useState, useEffect } from 'react';

interface Props {
    answer: Answer;
    onEdit?: () => void;
    onDelete?: () => void;
}

function AnswerCard({ answer, onEdit, onDelete }: Props) {
    const { user, setUser, users, answers, setAnswers } = useAppStoreContext();
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        if (user) setUserVote(user.votedAnswers[answer.id] || null);
    }, [user, answer.id]);

    const author = users.find(u => u.id === answer.userId);

    const handleVote = (type: 'up' | 'down') => {
        if (!user) return;
        let prevVote = user.votedAnswers[answer.id] || null;
        let upDelta = 0, downDelta = 0;
        let newVotedAnswers = { ...user.votedAnswers };
        if (prevVote === type) {
            upDelta = type === 'up' ? -1 : 0;
            downDelta = type === 'down' ? -1 : 0;
            setUserVote(null);
            delete newVotedAnswers[answer.id];
            setUser({
                ...user,
                votedAnswers: newVotedAnswers,
            });
        } else {
            if (prevVote === 'up') upDelta = -1;
            if (prevVote === 'down') downDelta = -1;
            if (type === 'up') upDelta += 1;
            if (type === 'down') downDelta += 1;
            setUserVote(type);
            newVotedAnswers[answer.id] = type;
            setUser({
                ...user,
                votedAnswers: newVotedAnswers,
            });
        }
        setAnswers(
            answers.map(a =>
                a.id === answer.id
                    ? {
                        ...a,
                        votes: {
                            up: a.votes.up + upDelta,
                            down: a.votes.down + downDelta,
                        },
                    }
                    : a
            )
        );
    };

    const up = answer.votes.up;
    const down = answer.votes.down;
    const total = up + down;
    const upPercent = total > 0 ? (up / total) * 100 : 0;
    const downPercent = total > 0 ? (down / total) * 100 : 0;

    const date = new Date(answer.createdAt);
    const formattedDate = date.toLocaleString();

    return (
        <div className="bg-card border border-border rounded-lg shadow-sm flex items-stretch transition-colors relative min-h-[80px]">
            {/* Votes on the far left */}

            {/* LED bar next to votes */}
            <div className="flex items-stretch" style={{ width: '16px', position: 'relative' }}>
                <div style={{
                    width: '8px',
                    height: '100%',
                    background: total === 0 ? '#888' : 'transparent',
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {total > 0 && (
                        <>
                            <div style={{
                                width: '100%',
                                height: `${downPercent}%`,
                                background: '#f00',
                            }} />
                            <div style={{
                                width: '100%',
                                height: `${upPercent}%`,
                                background: '#0f0',
                            }} />
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-4 pl-2 pr-1">
                <button
                    className={`text-green-400 text-xl transition-all px-2 py-1 rounded ${userVote === 'up' ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] bg-green-900/30' : 'hover:drop-shadow-[0_0_4px_#22c55e]'}`}
                    onClick={() => handleVote('up')}
                    aria-label="Upvote"
                >
                    ▲<br />
                    <span className="text-base font-bold">{answer.votes.up}</span>
                </button>
                <button
                    className={`text-red-400 text-xl transition-all px-2 py-1 rounded ${userVote === 'down' ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] bg-red-900/30' : 'hover:drop-shadow-[0_0_4px_#ef4444]'}`}
                    onClick={() => handleVote('down')}
                    aria-label="Downvote"
                >
                    ▼<br />
                    <span className="text-base font-bold">{answer.votes.down}</span>
                </button>
            </div>
            <div className="flex-1 w-0 pl-8 py-4 pr-5 flex flex-col justify-between min-h-[80px]">
                <div className="mb-2 text-foreground break-words whitespace-normal">{answer.text}</div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>By: <span className="font-medium text-foreground">{author?.name || 'Anonymous'}</span></span>
                    <span className="italic">{formattedDate}</span>
                    {onEdit && (
                        <button
                            className="px-3 py-1 ml-2 rounded bg-muted text-foreground font-semibold shadow hover:bg-muted/80 focus-visible:bg-muted/90 transition-all text-xs"
                            onClick={onEdit}
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="px-3 py-1 ml-1 rounded bg-muted text-foreground font-semibold shadow hover:bg-muted/80 focus-visible:bg-muted/90 transition-all text-xs"
                            onClick={onDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnswerCard; 