import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import PasswordChangeModal from "../../components/PasswordChangeModal/PasswordChangeModal";

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
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    carNumber: "",
    email: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/authorize");
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
      const response = await fetch("/api/auth/user/update/", {
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
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update user data");
      }

      // Обновляем данные после сохранения
      const updatedResponse = await fetch("/api/auth/user/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const updatedData = await updatedResponse.json();
      setUserData(updatedData);
      
      alert("Данные успешно сохранены");
    } catch (err) {
      setError("Ошибка при сохранении");
      console.error("Ошибка сохранения:", err);
      alert(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (oldPassword: string, newPassword: string, confirmPassword: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/password/change/", {
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
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка при смене пароля");
      }
      
      return true;
    } catch (err) {
      console.error("Ошибка смены пароля:", err);
      throw err;
    }
  };

  if (loading) return <div><Loader/></div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>Данные пользователя не найдены</div>;

  return (
    <div className="user-profile">
      <h1>Личный кабинет</h1>
      
      <div className="user-profile__form">
        <div className="user-profile__field">
          <label>Логин</label>
          <input 
            type="text" 
            value={userData.username} 
            readOnly 
            className="readonly-input"
          />
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
            onClick={() => setShowPasswordModal(true)}
            className="link-button"
          >
            Сменить пароль
          </button>
          <button
            onClick={handleSave}
            className="primary-button"
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={handlePasswordUpdate}
        />
      )}
    </div>
  );
};

export default ProfilePage;