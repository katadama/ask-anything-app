import { useState } from 'react';

interface AddQuestionFormProps {
    onAdd: (text: string, description: string) => void;
}

function AddQuestionForm({ onAdd }: AddQuestionFormProps) {
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text.trim(), description.trim());
            setText('');
            setDescription('');
        }
    };

    return (
        <form className="space-y-2" onSubmit={handleSubmit}>
            <textarea
                className="w-full p-2 border border-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent"
                placeholder="Ask a question..."
                rows={3}
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <textarea
                className="w-full p-2 border border-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent"
                placeholder="Add a description (supports markdown)"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <button
                type="submit"
                className="px-4 py-2 rounded bg-accent text-accent-foreground font-semibold shadow hover:bg-accent/80 focus-visible:bg-accent/90 transition-all"
                disabled={!text.trim()}
            >
                Submit
            </button>
        </form>
    );
}

export default AddQuestionForm; 