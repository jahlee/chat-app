import React from "react";
import '../styling/Home.css';

function Home() {
    return (
        <div className="homepage-container">
        <header className="homepage-header">
          <h1>Welcome to My Chat App</h1>
        </header>
        <nav className="homepage-nav">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </nav>
        <main className="homepage-main">
          <section id="about">
            <h2>About</h2>
            <p>This is a chat app where you can create a profile and chat with friends.</p>
          </section>
          <section id="features">
            <h2>Features</h2>
            <ul>
              <li>Create a profile</li>
              <li>Chat with friends</li>
              <li>Real-time messaging</li>
            </ul>
          </section>
          <section id="contact">
            <h2>Contact</h2>
            <p>For more information, please contact us at michael.scott@gmail.com</p>
          </section>
        </main>
        <footer className="homepage-footer">
          <p>Copyright © My Chat App</p>
        </footer>
      </div>
    );
}

export default Home;