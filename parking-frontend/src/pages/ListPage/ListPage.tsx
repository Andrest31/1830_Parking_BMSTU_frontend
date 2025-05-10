import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { fetchUserOrders } from "../../utils/ordersSlice";
import "./ListPage.css";

const UserRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(state => state.orders);
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      
      dispatch(fetchUserOrders());
    }
  }, [dispatch, token]);

  if (!token) {
    return (
      <div className="auth-required">
        <h2>Для просмотра заявок необходимо авторизоваться</h2>
      </div>
    );
  }

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="user-requests">
      <h1 className="user-requests__title">Мои заявки</h1>

      {orders.length === 0 ? (
        <div className="no-orders">У вас нет активных заявок</div>
      ) : (
        <table className="user-requests__table">
          <thead>
            <tr>
              <th>Дата заявки</th>
              <th>Дедлайн</th>
              <th>Имя</th>
              <th>Гос Номер</th>
              <th>Парковки и места</th>
              <th>Места</th>
              <th>Статус</th>
            </tr>
          </thead>
           <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{new Date(order.created_at).toLocaleDateString()}</td>
            <td>{order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}</td>
            <td>{order.full_name}</td>
            <td>{order.car_number}</td>
            <td>
              {order.items.map((item) => (  // Используем items вместо parkings
                <div key={item.id}>
                  {item.parking.name} — {item.quantity} шт.
                </div>
              ))}
            </td>
            <td>
              {order.items.reduce((sum, item) => sum + item.quantity, 0)}
            </td>
            <td>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
        </table>
      )}
    </div>
  );
};

export default UserRequests;