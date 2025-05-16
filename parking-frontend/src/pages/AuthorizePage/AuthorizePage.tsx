import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { login, register } from '../../utils/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './AuthorizePage.module.scss';

const AuthorizePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({ username: '', password: '' });

  const [signUpData, setSignUpData] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [signUpErrors, setSignUpErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const errors = { username: '', password: '' };
    if (!loginData.username) errors.username = 'Введите логин';
    if (!loginData.password) errors.password = 'Введите пароль';
    
    setLoginErrors(errors);
    if (errors.username || errors.password) return;
    
    try {
      const result = await dispatch(login(loginData));
      if (login.fulfilled.match(result)) {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const errors = { 
      username: '', 
      password: '', 
      confirmPassword: '' 
    };
    
    if (!signUpData.username) errors.username = 'Введите логин';
    if (!signUpData.password) errors.password = 'Введите пароль';
    if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    setSignUpErrors(errors);
    if (errors.username || errors.password || errors.confirmPassword) return;
    
    try {
      const result = await dispatch(register({
        username: signUpData.username,
        password: signUpData.password,
        password2: signUpData.confirmPassword
      }));
      
      if (register.fulfilled.match(result)) {
        // Автоматически входим после регистрации
        await dispatch(login({
          username: signUpData.username,
          password: signUpData.password
        }));
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.formsSection}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLoginActive ? styles.activeTab : ''}`}
            onClick={() => setIsLoginActive(true)}
          >
            Вход
          </button>
          <button
            className={`${styles.tab} ${!isLoginActive ? styles.activeTab : ''}`}
            onClick={() => setIsLoginActive(false)}
          >
            Регистрация
          </button>
        </div>

        <div className={styles.formContainer}>
          <div
            className={`${styles.formWrapper} ${styles.login} ${
              isLoginActive ? styles.active : ''
            }`}
          >
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <h2 className={styles.formTitle}>Вход</h2>
              <div className={styles.inputBlock}>
                <label htmlFor="login-username">Логин</label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  value={loginData.username}
                  onChange={handleLoginChange}
                />
                {loginErrors.username && <span className={styles.error}>{loginErrors.username}</span>}
              </div>
              <div className={styles.inputBlock}>
                <label htmlFor="login-password">Пароль</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                {loginErrors.password && <span className={styles.error}>{loginErrors.password}</span>}
              </div>
              {error && <div className={styles.apiError}>{error}</div>}
              <button 
                type="submit" 
                className={styles.AcceptButton}
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'Принять'}
              </button>
            </form>
          </div>

          <div
            className={`${styles.formWrapper} ${styles.register} ${
              !isLoginActive ? styles.active : ''
            }`}
          >
            <form className={styles.form} onSubmit={handleSignUpSubmit}>
              <h2 className={styles.formTitle}>Регистрация</h2>
              <div className={styles.inputBlock}>
                <label htmlFor="signup-username">Логин</label>
                <input
                  id="signup-username"
                  name="username"
                  type="text"
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                />
                {signUpErrors.username && <span className={styles.error}>{signUpErrors.username}</span>}
              </div>
              <div className={styles.inputBlock}>
                <label htmlFor="signup-password">Пароль</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                />
                {signUpErrors.password && <span className={styles.error}>{signUpErrors.password}</span>}
              </div>
              <div className={styles.inputBlock}>
                <label htmlFor="signup-password-confirm">Подтвердите пароль</label>
                <input
                  id="signup-password-confirm"
                  name="confirmPassword"
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                />
                {signUpErrors.confirmPassword && (
                  <span className={styles.error}>{signUpErrors.confirmPassword}</span>
                )}
              </div>
              {error && <div className={styles.apiError}>{error}</div>}
              <button 
                type="submit" 
                className={styles.AcceptButton}
                disabled={isLoading}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthorizePage;