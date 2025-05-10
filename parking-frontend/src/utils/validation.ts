// validationHandlers.ts

import React from 'react';

// Интерфейс для ошибок валидации
export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Интерфейс для данных логина
export interface LoginData {
  email: string;
  password: string;
}

// Интерфейс для данных регистрации
export interface SignUpData extends LoginData {
  confirmPassword: string;
}

// Функция валидации email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Тип функции для обработки изменений в данных
type HandleChangeFunction<T> = (
  field: keyof T,
  value: string,
  currentData: T,
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
  setData: React.Dispatch<React.SetStateAction<T>>
) => void;

// Обработка изменений для логина
export const handleLoginChange: HandleChangeFunction<LoginData> = (
  field,
  value,
  currentData,
  setErrors,
  setData
): void => {
  setData({ ...currentData, [field]: value } as LoginData);

  setErrors((prevErrors) => {
    const newErrors: ValidationErrors = { ...prevErrors };
    if (field === 'email') {
      if (!value) {
        newErrors.email = 'E-mail is required';
      } else if (!validateEmail(value)) {
        newErrors.email = 'Invalid e-mail format';
      } else {
        newErrors.email = '';
      }
    }
    if (field === 'password') {
      newErrors.password = value ? '' : 'Password is required';
    }
    return newErrors;
  });
};

// Обработка изменений для регистрации
export const handleSignUpChange: HandleChangeFunction<SignUpData> = (
  field,
  value,
  currentData,
  setErrors,
  setData
): void => {
  setData({ ...currentData, [field]: value } as SignUpData);

  setErrors((prevErrors) => {
    const newErrors: ValidationErrors = { ...prevErrors };

    // Деструктуризация данных с учетом изменения поля
    const { password, confirmPassword } = { ...currentData, [field]: value } as SignUpData;

    if (field === 'email') {
      if (!value) {
        newErrors.email = 'E-mail is required';
      } else if (!validateEmail(value)) {
        newErrors.email = 'Invalid e-mail format';
      } else {
        newErrors.email = '';
      }
    }
    if (field === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        newErrors.password = '';
      }
      if (value !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        newErrors.confirmPassword = '';
      }
    }
    if (field === 'confirmPassword') {
      if (value !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        newErrors.confirmPassword = '';
      }
    }

    return newErrors;
  });
};
