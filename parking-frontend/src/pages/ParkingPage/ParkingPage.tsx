import React from 'react';
import './ParkingPage.css';
import Footer from "../../components/Footer/Footer";


interface Parking {
    id: number;
    short_name: string;
    description: string;
    description_url: string;
    open_hour: number;
    close_hour: number;
  }

  interface ParkingPageProps {
    parking: Parking;
  }
  
const ParkingPage: React.FC<ParkingPageProps> = ({ parking }) => {
  return (
    <div className="app-container">

      {/* Main Content */}
      <div className="image-container">
        <img src={parking.description_url} alt="Parking" className="parking-img" />
        <div className="parking-title">Аренда места у {parking.short_name}</div>
      </div>

      <div className="parking-info">
        <div className="parking-info-cards">
          <div className="parking-info-card">
            <div className="info-card-title">Назначение</div>
            <div className="info-card-discription">{parking.description}</div>
          </div>
          <div className="parking-info-card">
            <div className="info-card-title">Время открытия</div>
            <div className="info-card-discription">{parking.open_hour}:00</div>
          </div>
          <div className="parking-info-card">
            <div className="info-card-title">Время закрытия</div>
            <div className="info-card-discription">{parking.close_hour}:00</div>
          </div>
        </div>
        <div className="parking-add-button">
          <a href={`/add-to-order/${parking.id}`} className="add_to_o_btn">добавить</a>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default ParkingPage;