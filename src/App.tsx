import Router from "./routes/index";
import store from "./store/store.ts";
import { Provider } from "react-redux";
import { AppToaster } from "./components/features/AppToaster.tsx";

const App = () => {
  return (
    <Provider store={store}>
      <AppToaster />
      <Router />
    </Provider>
  );
};

export default App;
