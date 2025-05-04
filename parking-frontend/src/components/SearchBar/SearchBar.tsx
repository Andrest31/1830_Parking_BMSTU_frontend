import { useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (time: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className="search-line">
      <form onSubmit={handleSubmit} method="GET">
        <input
          name="work_hour"
          placeholder="Время работы"
          className="search-bar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit" className="search-button">
          Найти
        </button>
        
      </form>
    </div>
  );
};

export default SearchBar;