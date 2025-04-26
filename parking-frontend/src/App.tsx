import { BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      
      <div className="app">
        <Header/>
        <Routes>
          {/* Здесь будут ваши Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App