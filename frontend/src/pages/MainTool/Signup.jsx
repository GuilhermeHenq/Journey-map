import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth } from '../../services/firebase'
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react'
import secureLocalStorage from "react-secure-storage";

import img from "../../assets/mascote.png";

import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        secureLocalStorage.setItem("token", user.accessToken);
        secureLocalStorage.setItem("user", JSON.stringify(user));
        setLoggedIn(true);
        showSucess();
        
    } catch (error) {
        console.error(error);
        showError(error);
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
            <div className="wrap-input">
              <input
                className={confirmPassword !== "" ? "has-val input" : "input"}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Confirme sua senha"></span>
              <button
                type="button"
                className="show-password-button"
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