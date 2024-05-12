import AppRoutes from "../routes";
import { Route, Routes } from "react-router-dom";

const Layout = () => {
  return (
    <div className="drawer-content">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-primary drawer-button md:hidden"
      >
        Open drawer
      </label>
      <Routes>
        {AppRoutes.map((item, index) => {
          return (
            <Route key={index} path={`${item.path}`} element={item.component} />
          );
        })}
      </Routes>
    </div>
  );
};

export default Layout;
