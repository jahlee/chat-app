import { auth, provider } from './firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuth }) {
  const navigate = useNavigate();  
  const googleSignIn = () => {
    signInWithPopup(auth, provider).then((res) => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate('/');
    });
  }
  return (
    <div className="googleLogin">
      <p> or sign in with Google</p>
      <button className="login-with-google-btn" onClick={googleSignIn}>sign in</button>
    </div>
  );
}

export default Login;
