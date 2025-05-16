import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { logout } from "../../utils/authSlice";
import "./Header.css";
import BMSTU_Logo from "../../assets/BMSTU_Logo.svg";
import ProfileIcon from "../../assets/Profile.svg";
import Logouticon from "../../assets/exit2.svg";
import apiClient from "../../utils/apiClient";

const Header = () => {
  const { access } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Отправляем запрос на бекенд для выхода
      await apiClient.post("/users/logout/");
      
      // Очищаем стор и localStorage
      dispatch(logout());
      
      // Перенаправляем на главную страницу
      navigate("/");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      // В любом случае выполняем логаут на клиенте
      dispatch(logout());
      navigate("/");
    }
  };

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
          {access && (
            <NavLink 
              to="/list" 
              className={({ isActive }) => 
                `navbar-item ${isActive ? "active" : ""}`
              }
            >
              Абонементы
            </NavLink>
          )}

          <NavLink 
            to="/parkings" 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            Парковки
          </NavLink>

          <NavLink 
            to={access ? "/profile" : "/authorize"} 
            className={({ isActive }) => 
              `navbar-item ${isActive ? "active" : ""}`
            }
          >
            <img src={ProfileIcon} alt="Профиль" className="profile" />
          </NavLink>

          {access && (
            <div 
              onClick={handleLogout}
              className="navbar-item logout-button"
            >
              <img src={Logouticon} alt="Выход" className="logout" />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;