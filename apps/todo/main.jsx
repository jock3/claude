import React from 'react';
import ReactDOM from 'react-dom/client';
import TodoLabb from './App.jsx';
import { registerSW } from './push.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoLabb />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) registerSW();
