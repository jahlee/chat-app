import { auth, googleProvider, facebookProvider, db } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import GoogleButton from "react-google-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import "../styling/Login.css";

function Login() {
  const navigate = useNavigate();

  const handleSignIn = (provider) => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        localStorage.setItem("isAuth", true);
        navigate("/chats");

        // add/update user entry in firestore
        const userDoc = doc(db, "users", res.user.uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          const newTimestamp = serverTimestamp();
          await updateDoc(userDoc, { last_active: newTimestamp }).catch(
            (err) => {
              console.error("error updating user doc:", err);
            }
          );
        } else {
          const newUser = {
            userId: res.user.uid,
            name: res.user.displayName,
            lowercase_name: res.user.displayName.toLowerCase(),
            email: res.user.email,
            photo_url: res.user.photoURL,
            last_active: serverTimestamp(),
          };
          await setDoc(userDoc, newUser);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  return (
    <div className="login-container">
      <h3 className="login-heading">Sign In</h3>
      <GoogleButton
        onClick={() => handleSignIn(googleProvider)}
        className="google-button"
      />
      <button
        onClick={() => handleSignIn(facebookProvider)}
        className="facebook-button"
      >
        {<FontAwesomeIcon icon={faSquareFacebook} size="2x" inverse />}
        <span className="facebook-login">Sign in with Facebook</span>
      </button>
    </div>
  );
}

export default Login;
