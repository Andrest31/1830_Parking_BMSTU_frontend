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
  const [updatingParkings, setUpdatingParkings] = useState<number[]>([]);

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

  // Функция для получения CSRF токена из куков
const getCsrfToken = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || '';
};

const handleFieldChange = async (field: string, value: string) => {
  if (!order) return;
  
  // Сохраняем предыдущее значение для отката
  const prevValue = order[field as keyof OrderDetail];
  
  // Оптимистичное обновление UI
  setOrder(prev => ({ ...prev!, [field]: value }));
  
  try {
    const response = await fetch(`/api/orders/${order.id}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка обновления');
    }

    // Получаем и применяем обновленные данные с сервера
    const updatedResponse = await fetch(`/api/orders/${order.id}/`);
    if (updatedResponse.ok) {
      const updatedOrder = await updatedResponse.json();
      setOrder(updatedOrder);
    }
    
  } catch (err) {
    console.error('Ошибка обновления:', err);
    
    // Откатываем изменения при ошибке
    setOrder(prev => ({ ...prev!, [field]: prevValue }));
    
    alert(err instanceof Error ? err.message : 'Ошибка обновления данных');
  }
};

  const updateQuantity = async (parkingId: number, newQuantity: number) => {
    if (!order || !parkingId || newQuantity < 1) return;
  
    // Блокируем UI на время запроса
    setUpdatingParkings(prev => [...prev, parkingId]);
  
    try {
      // 1. Отправляем обновление на сервер
      const response = await fetch(
        `/api/orders/${order.id}/items/${parkingId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
  
      // 2. Проверяем ответ сервера
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка обновления количества');
      }
  
      // 3. Оптимистичное обновление UI
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map(item => 
            item.parking?.id === parkingId 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        };
      });
  
      // 4. Получаем подтверждение с сервера (опционально)
      const updatedData = await response.json();
      console.log('Сервер подтвердил обновление:', updatedData);
  
    } catch (err) {
      console.error('Ошибка обновления:', err);
      
      // Откатываем изменения при ошибке
      const freshData = await fetch(`/api/orders/${order.id}/`).then(res => res.json());
      setOrder(freshData);
      
      alert(err instanceof Error ? err.message : 'Не удалось изменить количество');
    } finally {
      setUpdatingParkings(prev => prev.filter(id => id !== parkingId));
    }
  };
  
  // Обработчик изменения количества
  const handleQuantityChange = (parkingId: number, delta: number) => {
    if (!order) return;
    
    const currentItem = order.items.find(item => item.parking?.id === parkingId);
    if (!currentItem) return;
    
    const newQuantity = currentItem.quantity + delta;
    if (newQuantity < 1) return;
    
    updateQuantity(parkingId, newQuantity);
  };

  const handleRemoveItem = async (parkingId: number) => {
    if (!order || !window.confirm('Удалить парковку из заявки?')) return;
  
    setUpdatingParkings(prev => [...prev, parkingId]);
  
    try {
      const response = await fetch(
        `/api/orders/${order.id}/items/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({
            order_id: order.id,
            parking_id: parkingId
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось удалить элемент');
      }
  
      // Оптимистичное обновление UI
      setOrder(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.parking?.id !== parkingId)
      } : null);
  
    } catch (err) {
      console.error('Ошибка удаления:', err);
      
      // Откатываем изменения
      const freshData = await fetch(`/api/orders/${order.id}/`)
        .then(res => res.json());
      setOrder(freshData);
      
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    } finally {
      setUpdatingParkings(prev => prev.filter(id => id !== parkingId));
    }
  };

  const handleClearOrder = async () => {
    if (!order || !window.confirm('Вы уверены, что хотите удалить заявку?')) return;
  
    try {
      const response = await fetch(`/api/orders/${order.id}/delete/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': getCsrfToken(), // CSRF-токен для Django
        },
        credentials: 'include', // Для передачи куки (если требуется)
      });
  
      if (response.ok) {
        // Перенаправляем на главную страницу после удаления
        navigate('/');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось удалить заявку');
      }
    } catch (err) {
      console.error('Ошибка удаления заявки:', err);
      alert(err instanceof Error ? err.message : 'Не удалось удалить заявку');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
  
    try {
      const response = await fetch(`/api/orders/${order.id}/submit/`, {
        method: 'PUT',  // Используем PUT, как в API
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(), // Если Django требует CSRF
        },
        credentials: 'include', // Для передачи куки (если нужно)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка подтверждения заявки');
      }
  
      // Перенаправляем на страницу успеха
      navigate('/parkings');
    } catch (err) {
      console.error('Ошибка подтверждения заявки:', err);
      alert(err instanceof Error ? err.message : 'Не удалось отправить заявку');
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
                    order.items.map((item) => {
                      const parkingId = item.parking?.id;
                      if (!parkingId) return null;

                      return (
                        <div key={parkingId} className="pass-card">
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
                              onClick={() => handleQuantityChange(parkingId, -1)}
                              disabled={updatingParkings.includes(parkingId) || item.quantity <= 1}
                            >
                              -
                            </button>
                            <div className="pass-quantity">места: {updatingParkings.includes(parkingId) ? '...' : item.quantity}
                            </div>
                            <button 
                              type="button" 
                              className="pass-minus-button"
                              onClick={() => handleQuantityChange(parkingId, 1)}
                              disabled={updatingParkings.includes(parkingId)}
                            >
                              +
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleRemoveItem(parkingId)}
                              className="trash-button"
                              disabled={updatingParkings.includes(parkingId)}
                            >
                              <img src={TrashIcon} alt="Удалить" />
                            </button>
                          </div>
                        </div>
                      );
                    })
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