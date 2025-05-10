import Footer from "../../components/Footer/Footer";
import "./ParkingsPage.css";
import ParkingCard from "../../components/ParkingCard/ParkingCard"
import QuestBlock from "../../components/QuestBlock/QuestBlock";
import SearchBar from "../../components/SearchBar/SearchBar"
import ListIcon from "../../assets/list.svg"
import { Link } from "react-router-dom";
import { Parking, ParkingResponse } from '../../types';
import Loader from "../../components/Loader/Loader";
import { useEffect, useState } from "react";

const ParkingsPage = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTime] = useState<number | null>(null);
  const [draftOrderId, setDraftOrderId] = useState<number | null>(null);

  const checkDraftOrder = async () => {
    try {
      const response = await fetch('/api/parkings/');
      if (response.ok) {
        const data: ParkingResponse = await response.json();
        if (data.draft_order) {
          setDraftOrderId(data.draft_order.order_id);
        }
      }
    } catch (err) {
      console.error('Error checking draft order:', err);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch('/api/parkings/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ParkingResponse = await response.json();
        setParkings(data.parkings);
        setFilteredParkings(data.parkings);
        
        // Сохраняем ID черновика, если он есть
        if (data.draft_order) {
          setDraftOrderId(data.draft_order.order_id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
  
    fetchParkings();
  }, []);

  // Filter parkings based on search time
  useEffect(() => {
    if (searchTime !== null) {
      const filtered = parkings.filter(parking => 
        parking.open_hour <= searchTime && searchTime <= parking.close_hour
      );
      setFilteredParkings(filtered);
    } else {
      setFilteredParkings(parkings); // Show all parkings when no time is selected
    }
  }, [searchTime, parkings]);

  const handlePassButtonClick = (e: React.MouseEvent) => {
    if (!draftOrderId) {
      e.preventDefault();
      alert('Пожалуйста, сначала добавьте парковку в заявку');
    }
  };

  const handleTimeSearch = (time: string) => {
    const hour = parseInt(time, 10);
    if (!isNaN(hour) && hour >= 0 && hour <= 23) {
      const filtered = parkings.filter(
        parking => parking.open_hour <= hour && hour <= parking.close_hour
      );
      setFilteredParkings(filtered);
    }
  };

  const handleAddToOrder = async (parkingId: number, quantity: number): Promise<void> => {
    try {
      const response = await fetch(`/api/parkings/${parkingId}/add-to-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || '',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity }), // Отправляем количество на сервер
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      await checkDraftOrder();
      console.log('Added to order:', data);
      alert(`Добавлено ${quantity} парковочных мест! Текущее количество: ${data.quantity}`);
      
    } catch (err) {
      console.error('Error adding to order:', err);
      alert('Произошла ошибка при добавлении в заказ');
    }
  };
  
  // Функция для получения CSRF токена
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }

  if (loading) return <div><Loader/></div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="mainpage">
      <div className="title-content">
        <div className="title-items-container">
          <div className="title-item1">Парковочные места для сотрудников университета</div>
          <div className="title-item2">Доступны посуточная и бессрочная аренда мест. Срок действия абонемента любой. За абонементом закрепляется пропуск на парковку, парковаться можно на любом свободном месте.</div>
          <a 
            href="#catalog-section" 
            className="title-item4"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('catalog-section');
            }}
          >
            <div className="title-item3">Перейти</div>
          </a>
        </div>
        <img src={"http://localhost:9000/images/Kaban.jpg"} alt="Kaban" className="title-img" />
      </div>

      <div className="catalog" id="catalog-section">
        <div className="top-cont">
          <div className="Rent_line">
            <div className="Rent_title">Аренда места</div>
            <Link 
              to={draftOrderId ? `/pass/${draftOrderId}` : '#'} 
              onClick={handlePassButtonClick}
            >
              <img src={ListIcon} alt="List" className="Pass-button" />
            </Link>
          </div>
          <SearchBar 
            onSearch={handleTimeSearch} 
          />
        </div>

        <div className="catalog-content">
          {filteredParkings.length > 0 ? (
            filteredParkings.map(parking => (
              <ParkingCard 
                key={parking.id}
                parking={parking}
                onAddToOrder={handleAddToOrder}
              />
            ))
          ) : (
            <div className="no-results">
              {searchTime !== null 
                ? `Нет парковок, открытых в ${searchTime}:00` 
                : 'Нет доступных парковок'}
            </div>
          )}
        </div>
      </div>

      <QuestBlock/>
      <Footer/>
    </div>
  );
};

export default ParkingsPage;