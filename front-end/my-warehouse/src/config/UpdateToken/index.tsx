import axios from "axios";
import { API } from "..";
import { Navigate } from "react-router-dom";

const UpdateToken = () => {
  const updateAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axios.put(`${API}/authentication`, {
        refreshToken: refreshToken,
      });
      console.log("resp updateAccessToken", response);

      const { status, data } = response.data;
      if (status === "success") {
        console.log(data);
        localStorage.setItem("access_token", data.accessToken);
      }
    } catch (error: any) {
      console.error("Gagal memperbarui token:", error);
      if (error.response?.data.message === "jwt expired") {
        localStorage.clear();
        Navigate({ to: "/login" });
      }
    }
  };

  updateAccessToken();

  return null;
};

export default UpdateToken;
