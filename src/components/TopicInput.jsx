import { useDispatch, useSelector } from 'react-redux';
import { setFilterTerm, clearFilter } from '../redux/filterSlice';
import '../assets/styles/TopicInput.css'

function TopicInput() {
    const dispatch = useDispatch();
    const searchTerm = useSelector(state => state.filter.searchTerm);

    //Filters posts according to user input
    const handleChange = (e) => {
        dispatch(setFilterTerm(e.target.value));
    };
    //Clears the filter
    const handleClear = () => {
        dispatch(clearFilter());
    };

    return (
        <div className="topic-input">
        <input
            type="text"
            placeholder="Track a topic (enter keywords)"
            value={searchTerm}
            onChange={handleChange}
            aria-label="Search posts by topic"
        />
        {searchTerm && (
            <button onClick={handleClear} className="clear-btn" aria-label="Clear search">
            ×
            </button>
        )}
        </div>
    );
}

export default TopicInput;
