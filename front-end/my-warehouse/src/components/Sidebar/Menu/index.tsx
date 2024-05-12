import {
  ArrowLeftStartOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

const Menu = [
  {
    title: "Dashboard",
    icon: <HomeIcon width={35} />,
    uri: "/app/dashboard",
  },
  {
    title: "Log out",
    icon: <ArrowLeftStartOnRectangleIcon width={35} />,
    uri: "/login",
  },
];

export default Menu;
