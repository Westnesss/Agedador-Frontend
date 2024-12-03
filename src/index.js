import React from 'react';
import ReactDOM from 'react-dom/client'; // Usa 'react-dom/client' en lugar de 'react-dom'
import App from './App';
import './styles.css';

// Crear el contenedor raíz
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
