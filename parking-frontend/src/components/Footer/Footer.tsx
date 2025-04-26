import "./Footer.css";

const Footer = () => {
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
                    <img src="{% static 'telegram.svg' %}" alt="" className="telegram"></img>
                    <img src="{% static 'vk.svg' %}" alt="" className="vk"></img>
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