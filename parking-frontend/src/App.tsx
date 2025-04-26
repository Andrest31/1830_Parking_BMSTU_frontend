import { BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer"

function App() {
  return (
    <Router>
      
      <div className="app">
        <Header/>
        <Routes>
          {/* Здесь будут ваши Route */}
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App