import "./Header.css";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function Header({ search, setSearch }: Props) {
  return (
    <div className="header-container">
      <div className="header-top">
        <h1>Brain Drop!</h1>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search Note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
