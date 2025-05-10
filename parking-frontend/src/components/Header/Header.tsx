import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import BMSTU_Logo from "../../assets/BMSTU_Logo.svg"; // Импортируем изображения
import ProfileIcon from "../../assets/Profile.svg";
import Logouticon from "../../assets/exit2.svg"

const Header = () => {
  return (
    <header className="header_line">
      <div className="header_content">
        <img src={BMSTU_Logo} alt="Логотип МГТУ им. Баумана" className="bmstu_logo" />
        <Link to="/hello" style={{ textDecoration: 'none' }}>
          <div className="btn-1830">1830</div>
        </Link>
        <div className="parking-text-content">
          <div className="parking-text">Паркинг</div>
          <div className="parking-text">МГТУ им. Баумана</div>
        </div>

        <nav className="navbar">
          <NavLink 
            to="/list" 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            Абонементы
          </NavLink>

          <NavLink 
            to="/parkings" 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            Парковки
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            Профиль
          </NavLink>

          <NavLink 
            to="/authorize" 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            <img src={ProfileIcon} alt="Профиль" className="profile" />
          </NavLink>

          <NavLink 
            to="/logout" 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            <img src={Logouticon} alt="Выход" className="logout" />
          </NavLink>

        </nav>
      </div>

    </header>
  );
};

export default Header;