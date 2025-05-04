import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrashIcon from '../../assets/trash.svg';
import Footer from "../../components/Footer/Footer";
import './PassPage.css';

interface ParkingItem {
  id: number;
  parking: {
    short_name: string;
  };
  image: string;
  quantity: number;
}

interface Order {
  id: number;
  user_name: string;
  state_number: string;
  deadline: string;
  items: ParkingItem[];
}

const PassPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Mock data - replace with actual API calls
  const [order, setOrder] = useState<Order>({
    id: Number(orderId),
    user_name: '',
    state_number: '',
    deadline: new Date().toISOString().split('T')[0],
    items: [
      {
        id: 1,
        parking: { short_name: 'ГЗ' },
        image: 'http://localhost:9000/images/parking1.jpg',
        quantity: 1
      }
    ]
  });

  const handleFieldChange = async (field: string, value: string) => {
    // Update local state immediately
    setOrder(prev => ({ ...prev, [field]: value }));
    
    // API call to update the field on server
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
      });
      if (!response.ok) throw new Error('Update failed');
    } catch (error) {
      console.error('Error updating field:', error);
      // Revert state if update fails
      setOrder(prev => ({ ...prev, [field]: prev[field as keyof Order] }));
    }
  };

  const handleQuantityChange = async (itemId: number, action: 'increase' | 'decrease') => {
    // Find the item to update
    const itemIndex = order.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const newItems = [...order.items];
    const newQuantity = action === 'increase' 
      ? newItems[itemIndex].quantity + 1 
      : Math.max(1, newItems[itemIndex].quantity - 1);

    // Optimistic update
    newItems[itemIndex] = { ...newItems[itemIndex], quantity: newQuantity };
    setOrder(prev => ({ ...prev, items: newItems }));

    // API call
    try {
      const response = await fetch(`/api/orders/${order.id}/items/${itemId}/${action}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Quantity update failed');
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert state if update fails
      setOrder(prev => ({ ...prev, items: prev.items }));
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    // Optimistic update
    const newItems = order.items.filter(item => item.id !== itemId);
    setOrder(prev => ({ ...prev, items: newItems }));

    // API call
    try {
      const response = await fetch(`/api/orders/${order.id}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Remove item failed');
    } catch (error) {
      console.error('Error removing item:', error);
      // Revert state if update fails
      setOrder(prev => ({ ...prev, items: prev.items }));
    }
  };

  const handleClearOrder = async () => {
    if (window.confirm('Вы уверены, что хотите очистить заявку?')) {
      try {
        const response = await fetch(`/api/orders/${order.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error clearing order:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/orders/${order.id}/submit`, {
        method: 'POST',
      });
      if (response.ok) {
        navigate('/success');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Main Content */}
      <div className="Pass-page">
        <img src="http://localhost:9000/images/passPage.jpg" alt="Parking Pass" className="PassPage-img" />
        <div className="PassPage-Content">
          <form onSubmit={handleSubmit}>
            <div className="PassPage-top-block">
              <div className="left-block">
                <div className="PassPageTitle">Оформление абонемента</div>
                <div className="PassPageTitleDiscription">Все поля обязательны для заполнения</div>
                
                {/* Name Field */}
                <div className="PassPageDiscription">Ваше имя</div>
                <input
                  type="text"
                  className="PassInputField"
                  value={order.user_name}
                  onChange={(e) => handleFieldChange('user_name', e.target.value)}
                  required
                />

                {/* Car Number Field */}
                <div className="PassPageDiscription">Гос номер ТС</div>
                <input
                  type="text"
                  className="PassInputField"
                  value={order.state_number}
                  onChange={(e) => handleFieldChange('state_number', e.target.value)}
                  required
                />

                {/* Expiry Date Field */}
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
                          <img src={item.image} alt={""} className="pass-parking-img" />
                          <div className="pass-parking-name">{item.parking.short_name}</div>
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

      <Footer/>
    </div>
  );
};

export default PassPage;