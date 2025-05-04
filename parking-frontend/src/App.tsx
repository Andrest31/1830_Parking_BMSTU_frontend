import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./components/Header/Header";
import ParkingsPage from './pages/ParkingsPage/ParkingsPage';
import ParkingPage from './pages/ParkingPage/ParkingPage';
import HelloPage from './pages/HelloPage/HelloPage';
import PassPage from './pages/PassPage/PassPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <Router>
      <div className="app">
        <Header/>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<ParkingsPage />} />
          <Route path="/parkings" element={<ParkingsPage />} />
          <Route path="/parking/:id" element={<ParkingPage />} />
          <Route path="/pass" element={<PassPage />} />
          <Route path="/hello" element={<HelloPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App