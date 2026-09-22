import { useEffect, useState } from "react";
import { HandHeart } from "lucide-react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./api/client.js";
import { DashboardPage } from "./components/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((payload) => {
        setUser(payload.data);
        setScreen("dashboard");
      })
      .catch(() => setScreen("landing"));
  }, []);

  const authenticate = async (operation, values) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const payload = await operation(values);
      setUser(payload.data);
      setScreen("dashboard");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  if (screen === "loading") {
    return (
      <div className="app-loading">
        <span className="brand-mark">
          <HandHeart size={21} />
        </span>
        <span>Loading your bridge...</span>
      </div>
    );
  }

  if (screen === "landing") {
    return (
      <LandingPage
        onLogin={() => {
          setAuthError("");
          setScreen("login");
        }}
        onSignup={() => {
          setAuthError("");
          setScreen("signup");
        }}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginPage
        onLogin={{
          submit: (values) => authenticate(loginUser, values),
          error: authError,
          loading: authLoading,
        }}
        onSignup={() => {
          setAuthError("");
          setScreen("signup");
        }}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignupPage
        onSignup={{
          submit: (values) => authenticate(registerUser, values),
          error: authError,
          loading: authLoading,
        }}
        onLogin={() => {
          setAuthError("");
          setScreen("login");
        }}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      onLogout={async () => {
        await logoutUser().catch(() => {});
        setUser(null);
        setScreen("landing");
      }}
    />
  );
}

export default App;
