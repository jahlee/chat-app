import { auth, provider } from '../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button'

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
      <h3> Sign In with Google</h3>
      <GoogleButton onClick={() => googleSignIn()}/>
    </div>
  );
}

export default Login;
