export const getAuthToken = () => {
  const token = localStorage.getItem("refresh_token");
  return token;
};
