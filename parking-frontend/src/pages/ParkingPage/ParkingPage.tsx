import React, { useEffect, useState } from 'react';
import './ParkingPage.css';
import Footer from "../../components/Footer/Footer";
import { Parking } from '../../types';
import { useParams } from 'react-router-dom';
  
const ParkingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/parkings/${id}/`);
        if (!response.ok) {
          throw new Error('Парковка не найдена');
        }
        const data = await response.json();
        setParking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!parking) return <div>Парковка не найдена</div>;
  
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