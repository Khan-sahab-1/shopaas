// utils/validationHelper.js
import { Alert } from "react-native";

export const validateSignupForm = ({
  name,
  email,
  phone,
  password,
  confirmpassword,
  selectedCountry,
}) => {
  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name?.trim()) {
    return { valid: false, message: "Please enter your name" };
  }

  if (!email?.trim()) {
    return { valid: false, message: "Please enter your email" };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email" };
  }

  if (!selectedCountry) {
    return { valid: false, message: "Please select a country" };
  }

  if (!phone?.trim()) {
    return { valid: false, message: "Please enter your phone number" };
  }

  if (phone.length < 6 || phone.length > 15) {
    return { valid: false, message: "Phone number must be 6–15 digits long" };
  }

  if (!password?.trim()) {
    return { valid: false, message: "Please enter your password" };
  }

  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }

  if (password !== confirmpassword) {
    return { valid: false, message: "Passwords do not match" };
  }

  return { valid: true };
};


// utils/ValidationForm.js
export const validateCompanyForm = ({
  name,
  companyName,
  email,
  phone,
  selectedCountry,
  selectedState,
  selectedCity,
  selectdType,
  zip,
}) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name?.trim()) return { valid: false, message: "Please enter your name" };
  if (!companyName?.trim()) return { valid: false, message: "Please enter company / business name" };
  if (!email?.trim()) return { valid: false, message: "Please enter email" };
  if (!emailRegex.test(email)) return { valid: false, message: "Please enter a valid email" };
  if (!phone?.trim()) return { valid: false, message: "Please enter phone number" };
  if (phone.length < 6 || phone.length > 15)
    return { valid: false, message: "Phone number must be 6–15 digits long" };
  if (!selectdType) return { valid: false, message: "Please select business type" };
  if (!selectedCountry) return { valid: false, message: "Please select country" };
  if (!selectedState) return { valid: false, message: "Please select state" };
  if (!selectedCity) return { valid: false, message: "Please select city" };
  if (!zip?.trim()) return { valid: false, message: "Please enter ZIP code" };
  if (!/^\d{6}$/.test(zip)) return { valid: false, message: "ZIP code must be exactly 6 digits" };

  return { valid: true };
};






export const validateAddress = (address) => {
    const errors = {};
  
    // Name validation
    if (!address.name || address.name.trim() === "") {
      errors.name = "Name is required";
    } else if (address.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
  
    // Phone validation (10 digits example)
    if (!address.phone || address.phone.trim() === "") {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(address.phone)) {
      errors.phone = "Phone must be 10 digits";
    }
  
    // House Number
    if (!address.houseNumber || address.houseNumber.trim() === "") {
      errors.houseNumber = "House number is required";
    }
  
    // State
    if (!address.state || address.state.trim() === "") {
      errors.state = "State is required";
    }
  
    // City
    if (!address.city || address.city.trim() === "") {
      errors.city = "City is required";
    }
  
    // Zip (PIN code, 6 digits for India, update as per country)
    if (!address.zip || address.zip.trim() === "") {
      errors.zip = "ZIP/Postal code is required";
    } else if (!/^[0-9]{6}$/.test(address.zip)) {
      errors.zip = "ZIP must be 6 digits";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  