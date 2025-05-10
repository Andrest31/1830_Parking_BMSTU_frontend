import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrashIcon from '../../assets/trash.svg';
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";

import './PassPage.css';
import { OrderDetail } from '../../types';

const PassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingParkings, setUpdatingParkings] = useState<number[]>([]);
  const [updatingFields, setUpdatingFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}/`);
        if (!response.ok) {
          throw new Error('Заявка не найдена');
        }
        const data: OrderDetail = await response.json();
        
        // Форматируем дату для корректного отображения в input[type="date"]
        if (data.deadline) {
          const date = new Date(data.deadline);
          const formattedDate = date.toISOString().split('T')[0];
          data.deadline = formattedDate;
        }
        
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

  const handleFieldBlur = async (field: keyof OrderDetail, e: React.FocusEvent<HTMLInputElement>) => {
    if (!order) return;
    
    const newValue = e.target.value;
    const prevValue = order[field];
    
    // Если значение не изменилось, ничего не делаем
    if (newValue === prevValue) return;
    
    // Блокируем поле на время запроса
    setUpdatingFields(prev => [...prev, field as string]);
    
    try {
      const response = await fetch(`/api/orders/${order.id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ [field]: newValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка обновления');
      }

      // Получаем подтверждение от сервера
      const updatedData = await response.json();
      setOrder(prev => ({ ...prev!, ...updatedData }));

    } catch (err) {
      console.error('Ошибка обновления:', err);
      // Откатываем UI к предыдущему значению
      e.target.value = prevValue as string;
      alert(err instanceof Error ? err.message : 'Ошибка обновления данных');
    } finally {
      setUpdatingFields(prev => prev.filter(f => f !== field));
    }
  };

  const updateQuantity = async (parkingId: number, newQuantity: number) => {
    if (!order || !parkingId || newQuantity < 1) return;
  
    setUpdatingParkings(prev => [...prev, parkingId]);
  
    try {
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
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка обновления количества');
      }
  
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
  
      const updatedData = await response.json();
      console.log('Сервер подтвердил обновление:', updatedData);
  
    } catch (err) {
      console.error('Ошибка обновления:', err);
      const freshData = await fetch(`/api/orders/${order.id}/`).then(res => res.json());
      setOrder(freshData);
      alert(err instanceof Error ? err.message : 'Не удалось изменить количество');
    } finally {
      setUpdatingParkings(prev => prev.filter(id => id !== parkingId));
    }
  };
  
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
            parking_id: parkingId
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось удалить элемент');
      }
  
      setOrder(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.parking?.id !== parkingId)
      } : null);
  
    } catch (err) {
      console.error('Ошибка удаления:', err);
      const freshData = await fetch(`/api/orders/${order.id}/`).then(res => res.json());
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
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
      });
  
      if (response.ok) {
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка подтверждения заявки');
      }
  
      navigate('/parkings');
    } catch (err) {
      console.error('Ошибка подтверждения заявки:', err);
      alert(err instanceof Error ? err.message : 'Не удалось отправить заявку');
    }
  };

  if (loading) return <div><Loader/></div>;
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
                  defaultValue={order.user_name}
                  onBlur={(e) => handleFieldBlur('user_name', e)}
                  disabled={updatingFields.includes('user_name')}
                  required
                />
                {updatingFields.includes('user_name') && <span className="saving-indicator"><Loader/></span>}

                <div className="PassPageDiscription">Гос номер ТС</div>
                <input
                  type="text"
                  className="PassInputField"
                  defaultValue={order.state_number}
                  onBlur={(e) => handleFieldBlur('state_number', e)}
                  disabled={updatingFields.includes('state_number')}
                  required
                />
                {updatingFields.includes('state_number') && <span className="saving-indicator"><Loader/></span>}

                <div className="PassPageDiscription">Срок действия абонемента</div>
                <input
                  type="date"
                  className="PassInputField"
                  defaultValue={order.deadline}
                  onBlur={(e) => handleFieldBlur('deadline', e)}
                  disabled={updatingFields.includes('deadline')}
                  required
                />
                {updatingFields.includes('deadline') && <span className="saving-indicator"><Loader/></span>}
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
                              src={item.parking?.image_url || "http://localhost:9000/images/PassParking.jpg"} 
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