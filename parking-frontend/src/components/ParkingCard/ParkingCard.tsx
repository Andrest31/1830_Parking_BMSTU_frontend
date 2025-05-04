import { Link } from "react-router-dom";
import "./ParkingCard.css";
import MockImage from "./mock.jpg"

const ParkingCard = () => {
  return (
    <div>
        <div className="catalog-card">
              <img src={MockImage} alt="Mock" className="card-img" />
              <div className="card-info">
                <div className="parking-name">Главное здание</div>
                <div className="parking-place">ул. 2-ая Бауманская, д. 31</div>
              </div>
              <div className="parking-worktime">Открыто: 8:00 - 20:00</div>
              <Link to="/parking">
                <div className="card-button">подробнее</div>
              </Link>
        </div>
    
            <div className="item-lower-buttons">
              <div className="quantity-interface">
                <div className="minus-button">-</div>
                <div className="quantity">0</div>
                <div className="minus-button">+</div>
              </div>
              <div className="add-button">
                <a href="#" className="add_to_o_btn">Добавить</a>
              </div>
            </div>
    </div>

  );
};

export default ParkingCard;