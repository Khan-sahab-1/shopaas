import { showMessage } from "react-native-flash-message";

const MessageShow = {
  success: (message, description = '') => {
    showMessage({
      message: message,
      description: description,
      type: 'success',
      icon: 'success',
      duration: 2500, // 2.5 seconds
    });
  },

  error: (message, description = '') => {
    showMessage({
      message: message,
      description: description,
      type: 'danger',
      icon: 'danger',
      duration: 2500,
    });
  },

  info: (message, description = '') => {
    showMessage({
      message: message,
      description: description,
      type: 'info',
      icon: 'info',
      duration: 2500,
    });
  },
};

export default MessageShow;
