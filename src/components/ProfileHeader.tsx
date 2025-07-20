import { Link } from 'react-router-dom';
import { useAppStoreContext } from '../lib/useAppStore';

function ProfileHeader() {
    const { user } = useAppStoreContext();

    return (
        <header className="w-full bg-background border-b border-border shadow-sm">
            <nav className="container mx-auto flex items-center justify-between py-4">
                <Link to="/" className="text-3xl font-extrabold text-primary transition-colors ml-0">
                    ASK_ANYTHING_
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors"
                    >

                        <span>{user?.name || 'Anonymous'}</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}

export default ProfileHeader; 