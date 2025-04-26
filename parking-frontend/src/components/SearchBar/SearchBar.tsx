import "./SearchBar.css";


const SearchBar = () => {
  return (
    <div>
        <div className="search-line">
            <form method="GET">
              <input
                name="work_hour"
                placeholder="Время работы"
                className="search-bar"
                min="0"
                max="23"
              />
              <button type="submit" className="search-button">Найти</button>
            </form>
          </div>
    </div>

  );
};

export default SearchBar;