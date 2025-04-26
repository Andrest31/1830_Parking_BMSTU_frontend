import { NavLink } from "react-router-dom";
import "./Header.css";
import BMSTU_Logo from "../../assets/BMSTU_Logo.svg"; // Импортируем изображения
import ProfileIcon from "../../assets/Profile.svg";

const Header = () => {
  return (
    <header className="header_line">
      <div className="header_content">
        <img src={BMSTU_Logo} alt="Логотип МГТУ им. Баумана" className="bmstu_logo" />
        <div className="btn-1830">1830</div>
        <div className="parking-text-content">
          <div className="parking-text">Паркинг</div>
          <div className="parking-text">МГТУ им. Баумана</div>
        </div>

        <nav className="navbar">
          <NavLink 
            to="/parkings" 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            Парковки
          </NavLink>
          <button className="profile-button">
            <img src={ProfileIcon} alt="Профиль" className="profile" />
          </button>
        </nav>
      </div>

    </header>
  );
};

export default Header;