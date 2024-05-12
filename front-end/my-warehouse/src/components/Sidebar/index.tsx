import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import Layout from "../../Layout";
import ThemeToggle from "../ThemeToggle";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="drawer md:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <Layout />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-0 w-auto justify-between min-h-full bg-base-200 text-secondary">
          {/* Sidebar content here */}
          <li>
            <div>
              <ThemeToggle />
            </div>
          </li>
          {Menu.map((item, index) => {
            return (
              <li key={index} onClick={() => navigate(item.uri)}>
                <div>{item.icon}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
