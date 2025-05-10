import "./Footer.css";
import TelegramIcon from '../../assets/telegram.svg';
import VkIcon from '../../assets/vk.svg';

const Footer = () => {
  // Ссылки на соцсети
  const socialLinks = {
    telegram: 'https://t.me/HochuChipsov31',
    vk: 'https://vk.com/andreshpage'
  };

  return (
    <div>
      <div className="footer">
        <div className="footer-Title">© 2025 Московский государственный технический университет им. Н.Э. Баумана</div>
        <div className="white-line"></div>
        <div className="footer-info">
          <div className="contacts-block">
            <div className="contacts-title">Контакты учреждения</div>
            <div className="social">
              <div className="telephone">+79999686720</div>
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                <img src={TelegramIcon} alt="Telegram" className="telegram"></img>
              </a>
              <a href={socialLinks.vk} target="_blank" rel="noopener noreferrer">
                <img src={VkIcon} alt="VK" className="vk"></img>
              </a>
            </div>
            <div className="telephone">andrestvlad@gmail.com</div>
          </div>
          <div className="address-block">
            <div className="contacts-title">Юридический адрес</div>
            <div className="telephone">105005, Россия, Москва, ул. 2-я Бауманская, 5</div>
          </div>
        </div>

        <div className="disc-info">Оставаясь на сайте, вы выражаете свое согласие на обработку персональных данных и соглашаетесь с Политикой 
          Информация об объектах, приведённая на сайте, в том числе изображения и цены, не являются офертой</div>
      </div>
    </div>
  );
};

export default Footer;