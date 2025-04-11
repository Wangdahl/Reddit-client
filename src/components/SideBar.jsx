import { useDispatch, useSelector } from 'react-redux';
import { removeTrack, setDefaultTrack } from '../redux/tracksSlice';
import TopicInput from './TopicInput';

export default function Sidebar() {
    const dispatch = useDispatch();
    const { tracks, defaultTrack } = useSelector((state) => state.tracks);

    const handleSetDefault = (topic) => {
        console.log("Setting default track to:", topic);
        dispatch(setDefaultTrack(topic));
    };
    
    const handleRemove = (topic) => {
        console.log("Removing topic:", topic);
        dispatch(removeTrack(topic));
    };

    return (
        <aside className="sidebar">
        <h2>Tracked Topics</h2>
        <TopicInput />
        {tracks.length === 0 ? (
        <p>No topics tracked yet.</p>
        ) : (
            <ul className="tracked-topics">
            {tracks.map((topic) => (
                <li key={topic} className="tracked-topic">
                <button
                    type="button"
                    onClick={() => handleSetDefault(topic)}
                    className={topic === defaultTrack ? 'default-track' : ''}
                >
                    {topic}
                </button>
                <button
                    type="button"
                    onClick={() => handleRemove(topic)}
                    aria-label={`Remove ${topic}`}
                    className="remove-btn"
                >
                    Remove
                </button>
                </li>
            ))}
            </ul>
        )}
        {/* Refresh button to re-fetch the active topic's posts */}
        <button
            type='button'
            onClick={() => window.dispatchEvent(new Event('refreshTrack'))}
            title="Refresh topics"
            className="refresh-btn"
        >
            ↻
        </button>
    </aside>
    );
}
