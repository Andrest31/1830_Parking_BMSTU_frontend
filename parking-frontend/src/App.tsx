import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./components/Header/Header";
import ParkingsPage from './pages/ParkingsPage/ParkingsPage';

function App() {
  return (
    <Router>
      
      <div className="app">
        <Header/>
        <Routes>
          <Route path="/" element={<ParkingsPage />} />
          <Route path="/parkings" element={<ParkingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App