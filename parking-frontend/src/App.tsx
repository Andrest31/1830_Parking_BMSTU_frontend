import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./components/Header/Header";
import ParkingsPage from './pages/ParkingsPage/ParkingsPage';
import ParkingPage from './pages/ParkingPage/ParkingPage';
import HelloPage from './pages/HelloPage/HelloPage';
import PassPage from './pages/PassPage/PassPage';
import AuthorizePage from './pages/AuthorizePage/AuthorizePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ListPage from './pages/ListPage/ListPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import "./index.css"

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
          <Route path="/pass/:id" element={<PassPage />} />
          <Route path="/hello" element={<HelloPage />} />
          <Route path="/authorize" element={<AuthorizePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/list" element={<ListPage />} />          

        </Routes>
      </div>
    </Router>
  );
}

export default App