import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { fetchUserOrders } from "../../utils/ordersSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader"
import "./ListPage.css";

const UserRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useAppSelector((state) => state.orders);
  const { access, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !access) {
      navigate("/authorize");
      return;
    }

    dispatch(fetchUserOrders());
  }, [dispatch, access, isAuthenticated, navigate]);

  const handleRowClick = (orderId: number) => {
    navigate(`/pass/${orderId}`, { state: { fromListPage: true } });
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Для просмотра заявок необходимо авторизоваться</h2>
      </div>
    );
  }

  if (loading) return <div><Loader/></div>;
  if (error) return <div>Ошибка: {error}</div>;

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
              <tr 
                key={order.id} 
                onClick={() => handleRowClick(order.id)}
                className="user-requests__row"
              >
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}</td>
                <td>{order.full_name}</td>
                <td>{order.car_number}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.parking.short_name || item.parking.name} — {item.quantity} шт.
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