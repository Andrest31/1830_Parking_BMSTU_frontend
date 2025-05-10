import React, {useState } from 'react';
import styles from './AuthorizePage.module.scss';


const AuthorizePage: React.FC = (() => {

  const [isLoginActive, setIsLoginActive] = useState(true);


  const [loginData] = useState({ email: '', password: '' });
  const [loginErrors] = useState({ email: '', password: '' });

  const [signUpData] = useState({ email: '', password: '', confirmPassword: '' });
  const [signUpErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  

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
            <form className={styles.form} >
              <h2 className={styles.formTitle}>Вход</h2>
              <div className={styles.inputBlock}>
                <label htmlFor="login-email">Логин</label>
                <input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                />
                {loginErrors.email && <span className={styles.error}>{loginErrors.email}</span>}
              </div>
              <div className={styles.inputBlock}>
                <label htmlFor="login-password">Пароль</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                />
                {loginErrors.password && <span className={styles.error}>{loginErrors.password}</span>}
              </div>
              <button type="submit" className={styles.AcceptButton}>
                Принять
              </button>
            </form>
          </div>

          <div
            className={`${styles.formWrapper} ${styles.register} ${
              !isLoginActive ? styles.active : ''
            }`}
          >
            <form className={styles.form}>
              <h2 className={styles.formTitle}>Регистрация</h2>
              <div className={styles.inputBlock}>
                <label htmlFor="signup-email">Логин</label>
                <input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                />
                {signUpErrors.email && <span className={styles.error}>{signUpErrors.email}</span>}
              </div>
              <div className={styles.inputBlock}>
                <label htmlFor="signup-password">Пароль</label>
                <input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                />
                {signUpErrors.password && <span className={styles.error}>{signUpErrors.password}</span>}
              </div>
              <div className={styles.inputBlock}>
                <label htmlFor="signup-password-confirm">Подтвердите пароль</label>
                <input
                  id="signup-password-confirm"
                  type="password"
                  value={signUpData.confirmPassword}
                />
                {signUpErrors.confirmPassword && (
                  <span className={styles.error}>{signUpErrors.confirmPassword}</span>
                )}
              </div>
              <button type="submit" className={styles.AcceptButton}>
                Принять
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
});

export default AuthorizePage;