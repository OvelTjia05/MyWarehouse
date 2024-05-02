import { getAuthToken } from "./auth";
import AppRoutes from "./routes";

const App = () => {
  getAuthToken();

  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
