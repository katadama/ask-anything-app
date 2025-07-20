import { useAppStoreContext } from '../lib/useAppStore';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ProfilePage() {
    const { user, setUser, users, questions } = useAppStoreContext();
    const [name, setName] = useState(user?.name || '');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && name.trim()) {
            setUser({ ...user, name: name.trim() });
        }
    };

    const handleRemoveVote = (qid: string) => {
        if (!user) return;
        const newVotedQuestions = { ...user.votedQuestions };
        delete newVotedQuestions[qid];
        setUser({ ...user, votedQuestions: newVotedQuestions });
    };

    const handleAbandonProfile = () => {
        // Generate a new anonymous user profile
        const newUser = {
            id: crypto.randomUUID(),
            name: 'Anonymous',
            votedQuestions: {},
            votedAnswers: {},
        };
        setUser(newUser);
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <form className="space-y-4 max-w-md" onSubmit={handleSave}>
                <div>
                    <label className="block mb-1 font-medium">Display Name</label>
                    <input
                        className="w-full p-2 border border-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your display name"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-accent text-accent-foreground font-semibold shadow hover:bg-accent/80 focus-visible:bg-accent/90 transition-all"
                    disabled={!name.trim()}
                >
                    Save
                </button>
                <button
                    type="button"
                    className="ml-4 px-4 py-2 rounded bg-destructive text-white font-semibold shadow hover:bg-destructive/80 focus-visible:bg-destructive/90 transition-all"
                    onClick={handleAbandonProfile}
                >
                    Abandon Profile
                </button>
            </form>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Your Question Votes</h3>
                {user?.votedQuestions && Object.keys(user.votedQuestions).length > 0 ? (
                    <ul className="space-y-2">
                        {Object.entries(user.votedQuestions).map(([qid, vote]) => {
                            const q = questions.find(q => q.id === qid);
                            if (!q) return null;
                            const author = users.find(u => u.id === q.userId);
                            return (
                                <li key={qid} className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center gap-4 transition-colors group">
                                    <Link to={`/question/${qid}`} className="flex-1 font-semibold text-foreground hover:underline transition-colors group-hover:text-muted-foreground group-hover:opacity-40 group-hover:line-through duration-200 truncate overflow-hidden whitespace-nowrap max-w-full">
                                        {q.text}
                                    </Link>

                                    <span className={vote === 'up' ? 'text-green-400' : 'text-red-400' + ' group-hover:text-muted-foreground group-hover:opacity-40 duration-200'}>
                                        {vote === 'up' ? '▲ Upvoted' : '▼ Downvoted'}
                                    </span>
                                    <button
                                        className="ml-2 px-3 py-1 rounded bg-muted text-foreground font-semibold shadow hover:bg-muted/80 focus-visible:bg-muted/90 transition-all text-xs"
                                        onClick={() => handleRemoveVote(qid)}
                                    >
                                        Remove Vote
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-400">You haven't voted on any questions yet.</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage; 