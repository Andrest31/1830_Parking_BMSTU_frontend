import "./QuestBlock.css";


const QuestBlock = () => {
  return (
    <div>
        <div className="quest">
        <div className="quest-title">Основные вопросы</div>
        <div className="quest-content">
          <div className="quest-img-cont">
            <img src={"http://localhost:9000/images/quest.jpg"} alt="Quest" className="quest-img1" />
            <img src={"http://localhost:9000/images/quest.jpg"} alt="Quest" className="quest-img2" />
          </div>
          <div className="quest-block">
            <div className="quest-item">
              <div className="question">Сколько мест закрепляется за одним сотрудником?</div>
              <div className="answer">Вы можете бронировать любое количество мест</div>
            </div>

            <div className="quest-item">
              <div className="question">Как происходит оплата?</div>
                            <div className="answer">Безналичной оплатой в течении 15 минут после формирования заявки</div>

            </div>
            <div className="quest-item">
              <div className="question">Как проехать на парковку?</div>
                            <div className="answer">Показать QR Code, который будет выслан на почту</div>

            </div>
            <div className="quest-item">
              <div className="question">Можно ли оформить платеж в рассрочку?</div>
                            <div className="answer">Только полный единоразовый платеж</div>

            </div>
            <div className="quest-item">
              <div className="question">Можно ли отменить абонемент?</div>
                            <div className="answer">Если QR Code не был использован</div>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default QuestBlock;