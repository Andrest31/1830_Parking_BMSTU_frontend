import React, { useEffect, useState } from 'react';
import './ParkingPage.css';
import Footer from "../../components/Footer/Footer";
import { Parking } from '../../types';
import { useParams } from 'react-router-dom';
import Loader from "../../components/Loader/Loader";
  
const ParkingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const quantity = 1;

  const handleAddToOrder = async (parkingId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/parkings/${parkingId}/add-to-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*=\s*([^;]*).*$)|^.*$/, '$1') || '',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Added to order:', data);
      alert(`Добавлено ${quantity} парковочных мест! Текущее количество: ${data.quantity}`);
    } catch (err) {
      console.error('Error adding to order:', err);
      alert('Произошла ошибка при добавлении в заказ');
      throw err;
    }
  };

  const handleAddClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (parking) {
      await handleAddToOrder(parking.id, quantity);
    }
  };

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const response = await fetch(`/api/parkings/${id}/`);
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

  if (loading) return <div><Loader/></div>;
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
          <a href="#" className="add_to_o_btn" onClick={handleAddClick}>добавить</a>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default ParkingPage;