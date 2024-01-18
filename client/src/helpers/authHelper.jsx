const getUserDataFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const setUserDataToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUserDataFromLocalStorage = () => {
  localStorage.removeItem("user");
};

export { getUserDataFromLocalStorage, setUserDataToLocalStorage, removeUserDataFromLocalStorage };
