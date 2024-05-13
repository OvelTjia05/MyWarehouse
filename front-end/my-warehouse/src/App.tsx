import { Navigate, Route, Routes } from "react-router-dom";
import { getAuthToken } from "./auth";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = () => {
  function getDefaultTheme() {
    console.log("dddd");
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      const browserTheme = window.matchMedia(
        `(prefers-color-scheme: ${storedTheme})`
      ).matches
        ? storedTheme
        : null;

      if (browserTheme !== storedTheme) {
        document.querySelector("html")?.setAttribute("data-theme", storedTheme);
      }
    }
  }

  const PrivateRoute = ({ element }: any) => {
    return getAuthToken() ? element : <Navigate to="/login" replace />;
  };

  getAuthToken();
  getDefaultTheme();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            getAuthToken() ? (
              <Navigate to={"/app/dashboard"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/app/*" element={<PrivateRoute element={<Sidebar />} />} />
      </Routes>
    </>
  );
};

export default App;
