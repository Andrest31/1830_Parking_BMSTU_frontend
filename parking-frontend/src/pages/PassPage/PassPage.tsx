import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrashIcon from '../../assets/trash.svg';
import Footer from "../../components/Footer/Footer";
import './PassPage.css';
import { OrderDetail } from '../../types';

const PassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/${id}/`);
        if (!response.ok) {
          throw new Error('Заявка не найдена');
        }
        const data: OrderDetail = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleFieldChange = async (field: string, value: string) => {
    if (!order) return;
    
    // Оптимистичное обновление
    setOrder(prev => ({ ...prev!, [field]: value }));
    
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${order.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
      if (!response.ok) throw new Error('Ошибка обновления');
    } catch (err) {
      console.error('Ошибка обновления:', err);
      // Возвращаем предыдущее состояние при ошибке
      setOrder(prev => ({ ...prev!, [field]: prev![field as keyof OrderDetail] }));
    }
  };

  const handleQuantityChange = async (itemId: number, action: 'increase' | 'decrease') => {
    if (!order) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${order.id}/items/${itemId}/${action}/`,
        { method: 'POST' }
      );
      
      if (response.ok) {
        const updatedOrder = await fetchOrderData(order.id);
        setOrder(updatedOrder);
      } else {
        throw new Error('Не удалось изменить количество');
      }
    } catch (err) {
      console.error('Ошибка изменения количества:', err);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!order) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${order.id}/items/${itemId}/`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        const updatedOrder = await fetchOrderData(order.id);
        setOrder(updatedOrder);
      } else {
        throw new Error('Не удалось удалить элемент');
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const fetchOrderData = async (orderId: number): Promise<OrderDetail> => {
    const response = await fetch(`http://localhost:8000/api/orders/${orderId}/`);
    if (!response.ok) throw new Error('Ошибка загрузки данных');
    return await response.json();
  };

  const handleClearOrder = async () => {
    if (!order || !window.confirm('Вы уверены, что хотите очистить заявку?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/orders/${order.id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        navigate('/');
      }
    } catch (err) {
      console.error('Ошибка очистки заявки:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      const response = await fetch(`http://localhost:8000/api/orders/${order.id}/submit/`, {
        method: 'POST',
      });
      if (response.ok) {
        navigate('/success');
      }
    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Заявка не найдена</div>;

  return (
    <div className="app-container">
      <div className="Pass-page">
        <img src="http://localhost:9000/images/passPage.jpg" alt="Parking Pass" className="PassPage-img" />
        <div className="PassPage-Content">
          <form onSubmit={handleSubmit}>
            <div className="PassPage-top-block">
              <div className="left-block">
                <div className="PassPageTitle">Оформление абонемента</div>
                <div className="PassPageTitleDiscription">Все поля обязательны для заполнения</div>
                
                <div className="PassPageDiscription">Ваше имя</div>
                <input
                  type="text"
                  className="PassInputField"
                  value={order.user_name}
                  onChange={(e) => handleFieldChange('user_name', e.target.value)}
                  required
                />

                <div className="PassPageDiscription">Гос номер ТС</div>
                <input
                  type="text"
                  className="PassInputField"
                  value={order.state_number}
                  onChange={(e) => handleFieldChange('state_number', e.target.value)}
                  required
                />

                <div className="PassPageDiscription">Срок действия абонемента</div>
                <input
                  type="date"
                  className="PassInputField"
                  value={order.deadline}
                  onChange={(e) => handleFieldChange('deadline', e.target.value)}
                  required
                />
              </div>

              <div className="right-block">
                <div className="Pass-1830-Logo">1830</div>
                <div className="PassPageDiscription">Информация об абонементе:</div>
                <div className="Pass-Cards">
                  {order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="pass-card">
                        <div className="pass-card-left-block">
                          <img 
                            src={item.parking?.image_url || "http://localhost:9000/images/mock.jpg"} 
                            alt={item.parking?.short_name} 
                            className="pass-parking-img" 
                          />
                          <div className="pass-parking-name">{item.parking?.short_name}</div>
                        </div>
                        <div className="pass-card-right-block">
                          <button 
                            type="button" 
                            className="pass-minus-button"
                            onClick={() => handleQuantityChange(item.id, 'decrease')}
                          >
                            -
                          </button>
                          <div className="pass-quantity">места: {item.quantity}</div>
                          <button 
                            type="button" 
                            className="pass-minus-button"
                            onClick={() => handleQuantityChange(item.id, 'increase')}
                          >
                            +
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="trash-button"
                          >
                            <img src={TrashIcon} alt="Удалить" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pass-card" style={{ justifyContent: 'center' }}>
                      <div className="pass-parking-name">В заявке нет парковочных мест</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="PassButtons">
              <button 
                type="button" 
                className="clearButton"
                onClick={handleClearOrder}
              >
                Очистить
              </button>
              <button type="submit" className="AcceptButton">
                Принять
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PassPage;