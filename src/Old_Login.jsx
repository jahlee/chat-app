import React from 'react';
import { auth, provider } from './firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
    };
  
      // do this for callback, otherwise have to put
      // onSubmit={() => this.handleSubmit()}
      this.changeUsername = this.changeUsername.bind(this);
      this.changePassword = this.changePassword.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.googleSignIn = this.googleSignIn.bind(this);
      
    }
  
    changeUsername(event) {
      this.setState({username: event.target.value});
    }

    changePassword(event) {
        this.setState({password: event.target.value});
      }
  
    handleSubmit(event) {
        if (this.state.handle) {
            alert("Logged in!");
        event.preventDefault(); // prevents page from reloading and us losing our state
        }
    }

    googleSignIn() {
        let navigate = useNavigate();
        signInWithPopup(auth, provider).then((res) => {
            alert(res);
            localStorage.setItem("isAuth", true);
            this.props.setIsAuth(true);
            navigate('/');
        });
    }
  
    render() {
      return (
        <div>
            <form onSubmit={this.handleSubmit} class='App-header'>
            <label>
                <input type="text" value={this.state.username} onChange={this.changeUsername} placeholder="Username"/>
                <input type="password" value={this.state.handle} onChange={this.changePassword} placeholder="Password"/>
                <input type="submit" value="Submit" />
            </label>
            </form>
            <div className="googleLogin">
                <p> or sign in with Google</p>
                <button className="login-with-google-btn" onClick={this.googleSignIn}>sign in</button>
            </div>
        </div>
      );
    }
  }

export default Login;