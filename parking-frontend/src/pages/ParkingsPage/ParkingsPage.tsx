import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./ParkingsPage.css";
import ParkingCard from "../../components/ParkingCard/ParkingCard";
import QuestBlock from "../../components/QuestBlock/QuestBlock";
import SearchBar from "../../components/SearchBar/SearchBar";
import ListIcon from "../../assets/list.svg";
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
  const navigate = useNavigate();

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
        const token = localStorage.getItem('access_token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/parkings/', {
          headers
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ParkingResponse = await response.json();
        setParkings(data.parkings);
        setFilteredParkings(data.parkings);
        
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

  useEffect(() => {
    if (searchTime !== null) {
      const filtered = parkings.filter(parking => 
        parking.open_hour <= searchTime && searchTime <= parking.close_hour
      );
      setFilteredParkings(filtered);
    } else {
      setFilteredParkings(parkings);
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
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorData = { error: 'Unknown error' };
      try {
        errorData = text ? JSON.parse(text) : { error: `HTTP error! status: ${response.status}` };
      } catch {
        console.error('Failed to parse error response:', text);
      }
      throw new Error(errorData.error || 'Ошибка при добавлении в заказ');
    }

    const data = await response.json();
    setDraftOrderId(data.order_id);
    alert(`Добавлено ${quantity} парковочных мест!`);
    
  } catch (err) {
    console.error('Error adding to order:', err);
    alert(err instanceof Error ? err.message : 'Произошла ошибка при добавлении в заказ');
  }
};
  
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