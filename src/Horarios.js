import React, { useState } from 'react';

const Horarios = ({ horarios, reservas, onSeleccionarHorario }) => {
  const [grupo, setGrupo] = useState('');

  const handleChangeGrupo = (e) => {
    setGrupo(e.target.value);
  };

  const handleSeleccionar = (horario) => {
    if (grupo.trim() === '') {
      alert('Por favor, selecciona un grupo antes de asignar un horario.');
      return;
    }
    onSeleccionarHorario(grupo, horario);
    setGrupo('');
  };

  return (
    <div className="horarios-container">
      <div className="grupo-selector">
        <label htmlFor="grupo">Grupo: </label>
        <select id="grupo" value={grupo} onChange={handleChangeGrupo}>
          <option value="">Selecciona un grupo</option>
          {[...Array(8)].map((_, index) => (
            <option key={index} value={`Grupo ${index + 1}`}>
              Grupo {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="horarios-list">
        {horarios.map((horario) => (
          <button
            key={horario}
            className={`horario ${reservas[horario] ? 'ocupado' : ''}`}
            disabled={!!reservas[horario]}
            onClick={() => handleSeleccionar(horario)}
          >
            {horario} {reservas[horario] ? `(Asignado a ${reservas[horario]})` : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Horarios;