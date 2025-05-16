import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { useNavigate } from "react-router-dom";

interface UserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  car_number?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { access: token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    carNumber: "",
    email: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user/", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            navigate("/authorize");
            return;
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          carNumber: data.car_number || "",
          email: data.email || "",
        });
      } catch (err) {
        setError("Не удалось загрузить данные пользователя");
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("api/auth/user/", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          car_number: formData.carNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      alert("Данные успешно сохранены");
    } catch (err) {
      setError("Ошибка при сохранении");
      console.error("Ошибка сохранения:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("/auth/password/change/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password1: newPassword,
          new_password2: confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      alert("Пароль успешно изменен");
      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Ошибка при смене пароля");
      console.error("Ошибка смены пароля:", err);
    }
  };


  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>Данные пользователя не найдены</div>;

  return (
    <div className="user-profile">
      <h1>Личный кабинет</h1>
      
      <div className="user-profile__form">
        <div className="user-profile__field">
          <label>Логин</label>
          <input type="text" value={userData.username} readOnly />
        </div>

        <div className="user-profile__field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="user-profile__field">
          <label>Имя</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div className="user-profile__field">
          <label>Фамилия</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>

        <div className="user-profile__field">
          <label>Номер машины</label>
          <input
            type="text"
            name="carNumber"
            value={formData.carNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="user-profile__actions">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="link-button"
          >
            {showPasswordForm ? "Отменить" : "Сменить пароль"}
          </button>
          <button
            onClick={handleSave}
            className="primary-button"
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>

        {showPasswordForm && (
          <div className="user-profile__password-form">
            <h3>Смена пароля</h3>
            <input
              type="password"
              placeholder="Текущий пароль"
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
            <button
              onClick={handlePasswordUpdate}
              className="primary-button"
            >
              Обновить пароль
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;