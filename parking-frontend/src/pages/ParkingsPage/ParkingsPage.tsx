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
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/parkings/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ParkingResponse = await response.json();
        setParkings(data.parkings);
        setFilteredParkings(data.parkings); // Initialize filtered parkings with all parkings
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

  const handleTimeSearch = (time: string) => {
    const hour = parseInt(time, 10);
    if (!isNaN(hour) && hour >= 0 && hour <= 23) {
      const filtered = parkings.filter(
        parking => parking.open_hour <= hour && hour <= parking.close_hour
      );
      setFilteredParkings(filtered);
    }
  };

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
            <Link to={`/pass/${4}`}>
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