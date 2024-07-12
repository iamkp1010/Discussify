import { disconnectSocket, initiateSocketConnection } from "./socketHelper";

const getUserDataFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const setUserDataToLocalStorage = (user) => {
  initiateSocketConnection();
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUserDataFromLocalStorage = () => {
  disconnectSocket();
  localStorage.removeItem("user");
};

export { getUserDataFromLocalStorage, setUserDataToLocalStorage, removeUserDataFromLocalStorage };
