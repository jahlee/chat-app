import { useContext } from "react";
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
import UserContext from "../context/UserContext";
import "../styling/Login.css";

function Login({ setIsAuth }) {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignIn = (provider) => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        localStorage.setItem("isAuth", true);
        console.log("login response:", res);
        console.log("user values:", res.user);
        setIsAuth(true);
        navigate("/chats");

        // add/update user entry in firestore
        const userDoc = doc(db, "users", res.user.uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log("old user data:", userData);
          const newTimestamp = serverTimestamp();
          await updateDoc(userDoc, { last_logged_in: newTimestamp })
            .then(() => {
              setUser({
                ...userData,
                last_logged_in: newTimestamp,
              });
            })
            .catch((err) => {
              console.error("error updating user doc:", err);
            });
        } else {
          const newUser = {
            userId: res.user.uid,
            name: res.user.displayName,
            email: res.user.email,
            photo_url: res.user.photoURL,
            last_logged_in: serverTimestamp(),
          };
          console.log("creating new entry:", newUser);
          setUser(newUser);
          await setDoc(userDoc, newUser);
        }
      })
      .catch((err) => {
        console.log(err.message);
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
