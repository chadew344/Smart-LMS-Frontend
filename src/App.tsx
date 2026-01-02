import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import type { AppDispatch, RootState } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, type JSX } from "react";
import { refreshAuth } from "./store/slices/authSlice";
import Register from "./pages/Register";

const AppInitializer = ({ children }: { children: JSX.Element }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isInitialized, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    dispatch(refreshAuth());
  }, [dispatch]);

  if (!isInitialized || isLoading) {
    return <div>Checking session...</div>;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AppInitializer>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppInitializer>
    </Router>
  );
};

export default App;
