import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth } from '../../services/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react'

import img from "../../assets/mascote.png";

import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const showSucess = () => {
    toast.success('Cadastro realizado com sucesso!')
  };

  const showError = () => {
    toast.error('Cadastro invalido!')
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    
    e.preventDefault();
    try { 
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //console.log(userCredential);
        const user = userCredential.user;
        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setLoggedIn(true);
        showSucess();
        
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
            <span className="login-form-title"> Cadastrar-se </span>

            <span className="login-form-title">
              <img className="mascote" src={img} alt="Mascote" />
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
                Criar
              </button>
            </div>

            <div className="text-center">
              <span className="txt1">Já possui uma conta? </span>
              <Link className="txt2" to="/login"> 
                Logar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;