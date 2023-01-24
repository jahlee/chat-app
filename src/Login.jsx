import React from 'react';


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
  
    render() {
      return (
        <form onSubmit={this.handleSubmit} class='App-header'>
          <label>
            <input type="text" value={this.state.username} onChange={this.changeUsername} placeholder="Username"/>
            <input type="password" value={this.state.handle} onChange={this.changePassword} placeholder="Password"/>
            <input type="submit" value="Submit" />
          </label>
        </form>
      );
    }
  }

export default Login;