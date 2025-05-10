import React, { useState } from "react";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const [name, setName] = useState("Иванов Иван Иванович");
  const [carNumber, setCarNumber] = useState("А123ВС 77");
  const [email, setEmail] = useState("ivanov@bmstu.ru");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    console.log("Сохранено:", { name, carNumber, email });
  };

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert("Новый пароль и подтверждение не совпадают.");
      return;
    }

    console.log("Обновление пароля:", {
      oldPassword,
      newPassword,
    });

    // Здесь вызов API

    alert("Пароль обновлён.");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
  };

  return (
    <div className="user-profile">
      <h1 className="user-profile__title">Личный кабинет</h1>

      <div className="user-profile__form">
        <div className="user-profile__field">
          <label>ФИО</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="user-profile__field">
          <label>Номер машины</label>
          <input
            type="text"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
          />
        </div>

        <div className="user-profile__field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="user-profile__actions">
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="link-button"
            >
              Сменить пароль
            </button>
          ) : (
            <button
              onClick={() => setShowPasswordForm(false)}
              className="link-button"
            >
              Отменить смену пароля
            </button>
          )}
          <button onClick={handleSave} className="primary-button">
            Сохранить
          </button>
        </div>

        {showPasswordForm && (
          <div className="user-profile__password-form">
            <h3>Смена пароля</h3>
            <input
              type="password"
              placeholder="Старый пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Повторите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="primary-button" onClick={handlePasswordUpdate}>
              Обновить пароль
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
