import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const el = document.getElementById('root');

if (el) {
  const root = ReactDOM.createRoot(el);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
