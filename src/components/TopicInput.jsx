// src/components/TopicInput.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTrack } from '../redux/tracksSlice';
import '../assets/styles/TopicInput.css';

function TopicInput() {
    const dispatch = useDispatch();
    const [input, setInput] = useState('');

    // Update local input state on change.
    const handleChange = (e) => {
        setInput(e.target.value);
    };

    // On submit, dispatch addTrack to add the tracked topic.
    const handleSubmit = (e) => {
        e.preventDefault();
        const topic = input.trim();
        if (topic !== '') {
        dispatch(addTrack(topic));
        setInput('');
        }
    };

    return (
        <form className="topic-input" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Track a topic (enter keywords)"
            value={input}
            onChange={handleChange}
            aria-label="Search posts by topic"
        />
        {input && (
            <button type="submit" className="submit-btn" aria-label="Add track">
            Add
            </button>
        )}
        </form>
    );
}

export default TopicInput;
