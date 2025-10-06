import * as yup from 'yup';

export const signupinitialValue = {
  email: '',
  name: '',
  country: '',
  mobile: '',
  password: '',
  confirmPassword: '',
};

export const signupValidation = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),

  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),

  country: yup.string().required('Please select your country'),

  mobile: yup
    .string()
    .matches(/^[0-9]{6,15}$/, 'Mobile number must be valid')
    .required('Mobile number is required'),

  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});
