import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./components/Header/Header";
import ParkingsPage from './pages/ParkingsPage/ParkingsPage';
import ParkingPage from './pages/ParkingPage/ParkingPage';
import HelloPage from './pages/HelloPage/HelloPage';
import PassPage from './pages/PassPage/PassPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  const parkingData = {
    id: 1,
    short_name: "ГЗ",
    description: "Парковка для сотрудников и студентов",
    description_url: "http://localhost:9000/images/building1.jpg",
    open_hour: 8,
    close_hour: 22
  };
  return (
    <Router>
      <div className="app">
        <Header/>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<ParkingsPage />} />
          <Route path="/parkings" element={<ParkingsPage />} />
          <Route path="/parking" element={<ParkingPage parking={parkingData} />} />
          <Route path="/pass" element={<PassPage />} />
          <Route path="/hello" element={<HelloPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App