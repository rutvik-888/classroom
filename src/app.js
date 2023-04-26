// App.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const messageEl = useRef(null);

  useEffect(() => {
    socket.on('message', (data) => {
      setChat([...chat, data]);
    });
  });

  const handleLogin = () => {
    socket.emit('login', { name });
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', { name, message });
    setMessage('');
  };

  useEffect(() => {
    messageEl.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div>
      <h1>Classroom</h1>
      {name ? (
        <div>
          <h2>Welcome, {name}!</h2>
          <div>
            <form onSubmit={handleSubmit}>
              <input type="text" value={message} onChange={handleMessage} />
              <button type="submit">Send</button>
            </form>
            <div>
              {chat.map((item, index) => (
                <div key={index}>
                  <b>{item.name}:</b> {item.message}
                </div>
              ))}
              <div ref={messageEl}></div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
