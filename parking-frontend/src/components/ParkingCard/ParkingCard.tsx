import { Link } from "react-router-dom";
import "./ParkingCard.css";
import { Parking } from "../../types";

interface ParkingCardProps {
  parking: Parking;
}

const ParkingCard = ({ parking }: ParkingCardProps) => {
  return (
    <div>
        <div className="catalog-card">
              <img src={parking.image_url || "http://localhost:9000/images/mock.jpg"} alt="Mock" className="card-img" />
              <div className="card-info">
                <div className="parking-name">{parking.name}</div>
                <div className="parking-place">{parking.place}</div>
              </div>
              <div className="parking-worktime">Открыто: {parking.open_hour}:00 - {parking.close_hour}:00</div>
              <Link to={`/parking/${parking.id}`}>
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