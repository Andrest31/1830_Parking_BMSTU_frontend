import { Link } from "react-router-dom";
import "./ParkingCard.css";
import { Parking } from "../../types";
import { useState } from "react";

interface ParkingCardProps {
  parking: Parking;
  onAddToOrder: (parkingId: number, quantity: number) => Promise<void>;
}

const ParkingCard = ({ parking, onAddToOrder }: ParkingCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onAddToOrder(parking.id, quantity);
      // После успешного добавления сбрасываем счетчик
      setQuantity(1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }

  return (
    <div>
        <div className="catalog-card">
              <img src={parking.image_url || "http://localhost:9000/images/mock.jpg"} alt="Mock" className="card-img" />
              <div className="card-info">
                <div className="parking-name">{parking.name}</div>
                <div className="parking-place">{parking.place}</div>
              </div>
              <div className="parking-worktime">Открыто: {parking.open_hour}:00 - {parking.close_hour}:00</div>
              <Link to={`/parking/${parking.id}`} style={{ textDecoration: 'none' }}>
                <div className="card-button">подробнее</div>
              </Link>
        </div>
    
            <div className="item-lower-buttons">
              <div className="quantity-interface">
                <div className="minus-button" onClick={handleDecrement}>-</div>
                <div className="quantity">{quantity}</div>
                <div className="minus-button" onClick={handleIncrement}>+</div>
              </div>
              <div className="add-button">
                <a href="#" className="add_to_o_btn" onClick={handleAddClick}>Добавить</a>
              </div>
            </div>
    </div>

  );
};

export default ParkingCard;