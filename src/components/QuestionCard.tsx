import type { Question } from '../types/models';
import { Link } from 'react-router-dom';

interface Props {
    question: Question;
    onVote?: (type: 'up' | 'down') => void;
    onEdit?: () => void;
    onDelete?: () => void;
    answerCount?: number;
    authorName?: string;
    createdAt?: string;
}

function QuestionCard({ question, onVote, onEdit, onDelete, answerCount, authorName, createdAt }: Props) {
    // Calculate vote percentages
    const up = question.votes.up;
    const down = question.votes.down;
    const total = up + down;
    const upPercent = total > 0 ? (up / total) * 100 : 0;
    const downPercent = total > 0 ? (down / total) * 100 : 0;

    return (
        <div className="bg-card border border-border rounded-lg shadow-sm flex items-stretch transition-colors relative group cursor-pointer">
            {/* LED bar flush to the left, full height */}
            <div className="absolute left-0 top-0 h-full flex items-stretch" style={{ width: '16px' }}>
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
            <Link
                to={`/question/${question.id}`}
                className="flex-1 pl-8 p-5 flex items-center gap-6 focus:outline-none"
                tabIndex={-1}
                style={{ textDecoration: 'none' }}
            >
                <div className="flex-1 w-0">
                    <span className="font-semibold text-lg mb-2 block group-hover:underline transition-colors hover:drop-shadow-[0_0_4px_#38bdf8] focus-visible:drop-shadow-[0_0_8px_#38bdf8] truncate overflow-hidden whitespace-nowrap max-w-full">
                        {question.text}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap justify-between w-full">
                        <div className="flex items-center gap-4 flex-wrap">
                            {authorName && <span>By: <span className="font-medium text-foreground">{authorName}</span></span>}
                            {createdAt && <span className="italic">{createdAt}</span>}
                            {typeof answerCount === 'number' && <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-semibold">{answerCount} answer{answerCount === 1 ? '' : 's'}</span>}
                            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-semibold">{question.votes.up + question.votes.down} votes</span>
                        </div>
                        <div className="flex gap-2 items-center ml-auto">
                            {onEdit && (
                                <button
                                    className="px-3 py-1 rounded bg-muted text-foreground font-semibold shadow hover:bg-muted/80 focus-visible:bg-muted/90 transition-all text-xs"
                                    onClick={e => { e.stopPropagation(); e.preventDefault(); onEdit(); }}
                                >
                                    Edit
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="px-3 py-1 rounded bg-muted text-foreground font-semibold shadow hover:bg-muted/80 focus-visible:bg-muted/90 transition-all text-xs"
                                    onClick={e => { e.stopPropagation(); e.preventDefault(); onDelete(); }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default QuestionCard; 