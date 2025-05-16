import React, { useEffect, useState } from 'react';
import './ParkingPage.css';
import Footer from "../../components/Footer/Footer";
import { Parking } from '../../types';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from "../../components/Loader/Loader";
  
const ParkingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddToOrder = async (parkingId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/authorize');
        return;
      }

      const response = await fetch(`/api/parkings/${parkingId}/add-to-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRFToken': document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*=\s*([^;]*).*$)|^.*$/, '$1') || '',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: 1 }), // Фиксированное количество 1
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка HTTP! Статус: ${response.status}`);
      }

      await response.json();
      alert('Парковочное место добавлено в заказ!');
    } catch (err) {
      console.error('Ошибка при добавлении в заказ:', err);
      alert(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (parking) {
      handleAddToOrder(parking.id);
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