import Router from "./routes/index";
import store from "./store/store.ts";
import { Provider } from "react-redux";
import { AppToaster } from "./components/features/AppToaster.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AppToaster />
        <Router />
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
