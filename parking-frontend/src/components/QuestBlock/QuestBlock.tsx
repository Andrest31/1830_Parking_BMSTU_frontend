import "./QuestBlock.css";
import QuestImage from "../../assets/quest.jpg"


const QuestBlock = () => {
  return (
    <div>
        <div className="quest">
        <div className="quest-title">Основные вопросы</div>
        <div className="quest-content">
          <div className="quest-img-cont">
            <img src={QuestImage} alt="Quest" className="quest-img1" />
            <img src={QuestImage} alt="Quest" className="quest-img2" />
          </div>
          <div className="quest-block">
            <div className="quest-item">
              <div className="quest-btn">+</div>
              <div className="quest">Сколько мест закрепляется за одним сотрудником?</div>
            </div>

            <div className="quest-item">
              <div className="quest-btn">+</div>
              <div className="quest">Как происходит оплата?</div>
            </div>
            <div className="quest-item">
              <div className="quest-btn">+</div>
              <div className="quest">Как проехать на парковку?</div>
            </div>
            <div className="quest-item">
              <div className="quest-btn">+</div>
              <div className="quest">Можно ли оформить платеж в рассрочку?</div>
            </div>
            <div className="quest-item">
              <div className="quest-btn">+</div>
              <div className="quest">Можно ли отменить абонемент?</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default QuestBlock;