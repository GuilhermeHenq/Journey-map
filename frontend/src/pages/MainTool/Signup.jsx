import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth } from '../../services/firebase'
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'
import { toast } from 'sonner';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

import img from "../../assets/mascote.png";

import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const showSucess = () => {
    toast.success('Cadastro realizado com sucesso!')
  };

  const showError2 = () => {
    toast.error('Senhas não são iguais!')
  }

  const showError = (error) => {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Email já cadastrado!");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Email inválido!");
    } else if (error.code === "auth/weak-password") {
      toast.error("Senha deve conter mais de 6 caracteres!");
    } else {
      toast.error("Erro ao inserir o cadastro");
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    
    e.preventDefault();

    if (password !== confirmPassword) {
      showError2();
      return;
    }

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
            <span className={`login-form-title ${theme}`}> Cadastrar-se </span>

            <span className={`login-form-title ${theme}`}>
              <img className="mascote" src={img} alt="Mascote" />
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
                {showPassword ? <Eye/> : <EyeOff/>}
              </button>
            </div>
            <div className={`wrap-input ${theme}`}>
              <input
                className={confirmPassword !== "" ? `has-val input ${theme}` : `input ${theme}`}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className={`focus-input ${theme}`} data-placeholder="Confirme sua senha"></span>
              <button
                type="button"
                className={`show-password-button ${theme}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye/> : <EyeOff/>}
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
              <span className={`txt1 ${theme}`}>Já possui uma conta? </span>
              <Link className={`txt2 ${theme}`} to="/login"> 
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