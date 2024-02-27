import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react'

import img from "../../assets/mascote.png";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const showSuccess = () => {
    toast.success('Login realizado com sucesso!')
  };

  const showError = () => {
    toast.error('Login inválido!')
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
        showError();
    }
  };

  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form">
            <span className="login-form-title"> Login </span>

            <span className="login-form-title">
              <img src={img} alt="Mascote" />
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Email"></span>
            </div>

            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Password"></span>
              <button
                type="button"
                className="show-password-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye/> : <EyeOff/>}
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

            <div className="text-center">
              <span className="txt1">Não possui conta? </span>
              <Link className="txt2" to="/signup"> 
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
