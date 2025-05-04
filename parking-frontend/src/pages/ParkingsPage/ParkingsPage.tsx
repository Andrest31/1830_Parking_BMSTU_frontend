import Footer from "../../components/Footer/Footer";
import "./ParkingsPage.css";
import ParkingCard from "../../components/ParkingCard/ParkingCard"
import QuestBlock from "../../components/QuestBlock/QuestBlock";
import SearchBar from "../../components/SearchBar/SearchBar"
import ListIcon from "../../assets/list.svg"
import { Link } from "react-router-dom";
import { Parking, ParkingResponse } from '../../types';
import { useEffect, useState } from "react";


const ParkingsPage = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/parkings/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ParkingResponse = await response.json();
        setParkings(data.parkings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="mainpage">
      <div className="title-content">
        <div className="title-items-container">
          <div className="title-item1">Парковочные места для сотрудников университета</div>
          <div className="title-item2">Доступны посуточная и бессрочная аренда мест. Срок действия абонемента любой. За абонементом закрепляется пропуск на парковку, парковаться можно на любом свободном месте.</div>
          <a href="#" className="title-item4">
            <div className="title-item3">Перейти</div>
          </a>
        </div>
        <img src={"http://localhost:9000/images/Kaban.jpg"} alt="Kaban" className="title-img" />
      </div>

      <div className="catalog" id="catalog-section">
        <div className="top-cont">
          <div className="Rent_line">
            <div className="Rent_title">Аренда места</div>
            <Link to="/pass">
              <img src={ListIcon} alt="List" className="Pass-button" />
            </Link>

          </div>
          <SearchBar/>
        </div>

        <div className="catalog-content">
          {/* Пример одного элемента парковки */}
          {parkings.length > 0 ? (
            parkings.map(parking => (
              <ParkingCard 
                key={parking.id}
                parking={parking}
              />
            ))
          ) : (
            <div className="no-results">Нет доступных парковок</div>
          )}
          {/* Сообщение при отсутствии парковок */}
          {/* <div className="no-results">Нет доступных парковок для выбранного времени</div> */}
        </div>
      </div>

      <QuestBlock/>

    <Footer/>
    </div>
  );
};

export default ParkingsPage;