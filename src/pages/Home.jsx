import React from "react";
import '../styling/Home.css';

function Home() {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Chat App</h1>
      </header>
      <nav className="homepage-nav">
        <a href="#about">About</a>
        <a href="#features">Features</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="nav-line" />
      <main className="homepage-main">
        <section id="about">
          <h2>About</h2>
          <p>This is a chat app where you can create a profile and chat with friends.</p>
          <p>In future updates, the app will also feature end-to-end encryption for secure communication between users.</p>
          <p>Also, you will be able to create group chats with multiple friends and send files such as images and documents.</p>
          <p>We will also let you see send/receive updates.</p>
        </section>
        <section id="features">
          <h2>Features</h2>
          <ul>
            <li>Create a profile</li>
            <li>Chat with friends</li>
            <li>Real-time messaging</li>
            <li>Send images and documents</li>
            <li>End-to-end encryption</li>
            <li>Create group chats</li>
            <li>See when your messages have been read</li>
          </ul>
        </section>
        <section id="contact">
          <h2>Contact</h2>
          <p>For more information, please contact us at michael.scott@gmail.com</p>
          <p>You can also follow us on Twitter at <a href="https://twitter.com/chat_app">@chat_app</a> for updates and news.</p>
        </section>
      </main>
      <footer className="homepage-footer">
        <p>Copyright © My Chat App</p>
      </footer>
    </div>
  );
}

export default Home;