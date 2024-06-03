import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { GoogleAuthProvider } from 'firebase/auth';

import img from "../../assets/mascote.png";
import Google from "../../assets/google.svg";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    console.log("Current theme:", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      console.log("Theme changed to:", newTheme);  // Log the new theme
      return newTheme;
    });
  };

  const showSuccess = () => {
    toast.success('Login realizado com sucesso!')
  };

  const showError = (error) => {
    if (error.code === "auth/invalid-email") {
      toast.error("Email inválido!");
    } else if (error.code === "auth/invalid-credential") {
      toast.error("Senha ou email incorretos!");
    } else {
      toast.error("Login inválido!");
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showSuccess();
      const user = userCredential.user;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
      showError(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      showSuccess();

      const user = userCredential.user;
      setGoogleUser({
        name: user.displayName,
        photo: user.photoURL
      });
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
      showError(error);
    }
  };

  return (
    <div className={`container ${theme}`}>
      <div className={`container-login ${theme}`}>
        <div className={`wrap-login ${theme}`}>
          <button onClick={toggleTheme} className="toggle-theme-btn">
            {theme === "dark" ? <Moon /> : <Sun />}
          </button>
          <form className="login-form">
            <span className={`login-form-title ${theme}`}> Login </span>

            <span className={`login-form-title ${theme}`}>
              <img src={img} alt="Mascote" />
            </span>

            <div className={`wrap-input ${theme}`}>
              <input
                className={email !== "" ? `has-val input ${theme}` : `input ${theme}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className={`focus-input ${theme}`} data-placeholder="Email"></span>
            </div>

            <div className={`wrap-input ${theme}`}>
              <input
                className={password !== "" ? `has-val input ${theme}` : `input ${theme}`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className={`focus-input ${theme}`} data-placeholder="Password"></span>
              <button
                type="button"
                className={`show-password-button ${theme}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <div className="container-login-form-btn">
              <button
                className="login-form-btn"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>

            <div className="container-login-form-btn">
              <button
                className={`login-google-btn ${theme}`}
                type="button"
                onClick={handleGoogleLogin}
              >
                <img className="img-google" src={Google} alt="Google logo" />
                Login com Google
              </button>
              {googleUser && (
                <div className="google-user-info">
                  <img src={googleUser.photo} alt="User" />
                  <p>{googleUser.name}</p>
                </div>
              )}
            </div>

            <div className="text-center">
              <span className={`txt1 ${theme}`}>Não possui conta? </span>
              <Link className={`txt2 ${theme}`} to="/signup">
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
