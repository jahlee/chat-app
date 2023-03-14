import { auth, googleProvider, facebookProvider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import '../styling/Login.css'

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        localStorage.setItem("isAuth", true);
        console.log("logged in with google", res);
        setIsAuth(true);
        navigate("/chats");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const facebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((res) => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/chats");
        console.log("signed in with facebook", res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="login-container">
      <h3 className="login-heading">Sign In</h3>
      <GoogleButton onClick={() => googleSignIn()} className="google-button"/>
      <button onClick={() => facebookSignIn()} className="facebook-button">
        {<FontAwesomeIcon icon={faSquareFacebook} size="2x" inverse />}
        <span className="facebook-login">Sign in with Facebook</span>
      </button>
    </div>
  );
}

export default Login;
