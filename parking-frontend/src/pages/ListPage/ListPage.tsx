import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListPage.css";

interface ParkingItem {
  name: string;
  quantity: number;
}

interface Request {
  id: number;
  dateCreated: string;
  deadline: string;
  carNumber: string;
  fullName: string;
  totalQuantity: number;
  status: "В обработке" | "Одобрено" | "Отклонено";
  parkings: ParkingItem[];
}

const mockRequests: Request[] = [
  {
    id: 1,
    dateCreated: "2025-05-01",
    deadline: "2025-06-01",
    carNumber: "А123ВС 77",
    fullName: "Иванов Иван",
    totalQuantity: 2,
    status: "В обработке",
    parkings: [
      { name: "Главное здание", quantity: 1 },
      { name: "Спортивный комплекс", quantity: 1 },
    ],
  },
  {
    id: 2,
    dateCreated: "2025-04-15",
    deadline: "2025-05-15",
    carNumber: "Т456ОР 99",
    fullName: "Петров Пётр",
    totalQuantity: 1,
    status: "Одобрено",
    parkings: [{ name: "Спортивный комплекс", quantity: 1 }],
  },
  {
    id: 3,
    dateCreated: "2025-03-20",
    deadline: "2025-04-20",
    carNumber: "М789КХ 177",
    fullName: "Сидоров Алексей",
    totalQuantity: 3,
    status: "Отклонено",
    parkings: [
      { name: "Главное здание", quantity: 2 },
      { name: "Учебно-лабораторный корпус", quantity: 1 },
    ],
  },
];

const UserRequests: React.FC = () => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate("/authorize");
  };

  return (
    <div className="user-requests">
      <h1 className="user-requests__title">Мои заявки</h1>

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
          {mockRequests.map((req) => (
            <tr
              key={req.id}
              onClick={handleRowClick}
              className="user-requests__row"
            >
              <td>{req.dateCreated}</td>
              <td>{req.deadline}</td>
              <td>{req.fullName}</td>
              <td>{req.carNumber}</td>
              <td>
                {req.parkings.map((p, i) => (
                  <div key={i}>
                    {p.name} — {p.quantity} шт.
                  </div>
                ))}
              </td>
              <td>{req.totalQuantity}</td>
              <td>
                <span className={`status ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRequests;
