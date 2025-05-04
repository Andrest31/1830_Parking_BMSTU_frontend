import React from 'react';
import Footer from "../../components/Footer/Footer";
import './HelloPage.css';

const HelloPage: React.FC = () => {
  return (
    <div className="app-container">
      {/* Main Content */}
      <div className="HelloPage">
        <img src={"http://localhost:9000/images/HelloPage.jpg"} alt="Welcome" className="HelloPage-img" />
        <div className="HelloPage-Content">
          <div className="HelloPageTitle">Добро пожаловать!</div>
          <div className="HelloPageTitleDiscription">
            Мы рады видеть вас на нашей странице. Узнайте больше о нас! Данная система предназначена для хранения 
            справочных данных о бронировании парковочных мест. Сотрудник университета, заметивший свободные места 
            на парковке и рассчитавший период нахождения своего транспортного средства или транспортных средств 
            на парковке, обращается к сервису с целью регистрации абонемента.
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="subscribe">
        <div className="subscribe-title">Подпишитесь на нашу рассылку</div>
        <div className="subscribe-block">
          <input 
            type="email" 
            placeholder="Введите вашу почту" 
            className="mail-input" 
          />
          <button className="sub-btn">Подтвердить</button>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default HelloPage;