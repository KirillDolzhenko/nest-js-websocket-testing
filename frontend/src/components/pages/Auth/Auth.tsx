import { useState } from 'react';
import classes from './Auth.module.scss';

export default function () {
  let [activeState, setActiveState] = useState<string>();

  return (
    <div className={classes.container}>
      <section className={classes.auth__wrapper}>
        <div className={classes.auth__content}>
          <h2>Привет! ✌️</h2>
          <p>Зайди или создай свой аккаунт, чтобы переписываться</p>

          <div className={classes.auth__buttons}>
            <button
              className={classes.auth__button}
              onClick={() => setActiveState('login')}
            >
              Войти
            </button>
            <button
              className={classes.auth__button}
              onClick={() => setActiveState('signup')}
            >
              Зарегистрироваться
            </button>
          </div>

          {activeState == 'login' ? (
            <form className={classes.auth__form}>
              <input
                className={classes.auth__input}
                placeholder="Имя"
                type="text"
              />
              <input
                className={classes.auth__input}
                placeholder="Пароль"
                type="password"
              />
              <button className={classes.auth__button}>Войти</button>
            </form>
          ) : (
            <></>
          )}
          {activeState == 'signup' ? (
            <form className={classes.auth__form}>
              <input
                className={classes.auth__input}
                placeholder="Имя"
                type="text"
              />
              <input
                className={classes.auth__input}
                placeholder="Почта"
                type="email"
              />
              <input
                className={classes.auth__input}
                placeholder="Пароль"
                type="password"
              />
              <input
                className={classes.auth__input}
                placeholder="Повторите пароль"
                type="password"
              />
              <button className={classes.auth__button}>
                Зарегистрироваться
              </button>
            </form>
          ) : (
            <></>
          )}
        </div>
      </section>
    </div>
  );
}
