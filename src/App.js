import React, { useState, useEffect } from "react";
import api from "./services/api"; // Asegúrate de que api.js esté configurado correctamente.

const App = () => {
  const [dias, setDias] = useState([
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
  ]);

  const horariosPorDia = {
    Lunes: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
    Martes: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
    Miércoles: ["07:00 - 08:00", "08:00 - 09:00"],
    Jueves: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
    Viernes: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
  };

  const [reservas, setReservas] = useState({});
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  const [passwords, setPasswords] = useState({});
  const [grupoAutenticado, setGrupoAutenticado] = useState(false);

  const ADMIN_PASSWORD = "admin123";

    const calcularFechasSemana = () => {
  const fechas = [];
  const hoy = new Date();
  const diaSemana = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)

  // Obtener la fecha de inicio de la semana actual (lunes)
  const inicioSemana = new Date(hoy);
  const diasHastaLunes = (diaSemana === 0 ? -6 : 1 - diaSemana); // Si es domingo, retrocede 6 días; si no, ajusta al lunes
  inicioSemana.setDate(hoy.getDate() + diasHastaLunes);

  // Crear un mapa de días para iterar
  const mapaDias = {
    Lunes: 0,
    Martes: 1,
    Miércoles: 2,
    Jueves: 3,
    Viernes: 4,
  };

  // Iterar sobre los días y calcular las fechas
  Object.keys(mapaDias).forEach((dia) => {
    const diasADesplazar = mapaDias[dia];
    const fecha = new Date(inicioSemana); // Basado en el lunes de la semana
    fecha.setDate(inicioSemana.getDate() + diasADesplazar); // Sumar los días correspondientes
    fechas.push({ dia, fecha: fecha.toLocaleDateString() });
  });

  return fechas;
};

const fechasDias = calcularFechasSemana();


  // Cargar reservas del backend al inicio
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await api.get("/reservas"); // Ajusta la ruta según tu backend
        setReservas(response.data);
      } catch (error) {
        console.error("Error al cargar reservas desde el backend:", error);
      }
    };

    fetchReservas();
  }, []);

  const handleSeleccionarGrupo = (grupo) => {
  setGrupoSeleccionado(grupo);
  setGrupoAutenticado(false); // Reiniciar autenticación
  if (!passwords[grupo]) {
    const nuevaContraseña = prompt(
      `Establece una contraseña para el grupo ${grupo}:`
    );
    if (nuevaContraseña) {
      setPasswords((prevPasswords) => ({
        ...prevPasswords,
        [grupo]: nuevaContraseña,
      }));
      alert(`Contraseña establecida para el grupo ${grupo}.`);
    } else {
      alert("Debes establecer una contraseña para continuar.");
      setGrupoSeleccionado("");
    }
  }
};

  const handleFinalizarSeleccion = () => {
    setGrupoSeleccionado("");
    setGrupoAutenticado(false);
    alert("Selección finalizada. Puedes seleccionar otro grupo.");
  };

  const handleSeleccionarHorario = async (dia, horario) => {
    if (!grupoSeleccionado) {
      alert("Por favor, selecciona un grupo antes de reservar un horario.");
      return;
    }

    if (!grupoAutenticado) {
      const contraseñaIngresada = prompt(
        `Ingresa la contraseña para el grupo ${grupoSeleccionado}:`
      );
      if (contraseñaIngresada !== passwords[grupoSeleccionado]) {
        alert("Contraseña incorrecta. No puedes realizar la reserva.");
        return;
      }
      setGrupoAutenticado(true);
      alert("Autenticación exitosa. Puedes continuar reservando horarios.");
    }

    const idHorario = `${dia}-${horario}`;
    const gruposReservados = reservas[idHorario] || [];

    // Verificar si el grupo ya ha reservado este horario
    if (gruposReservados.includes(grupoSeleccionado)) {
      alert(`El grupo ${grupoSeleccionado} ya ha reservado este horario.`);
      return;
    }

    // Verificar si el horario está lleno
    if (gruposReservados.length >= 4) {
      alert(
        `El horario ${horario} ya está lleno con 4 grupos: ${gruposReservados.join(", ")}.`
      );
      return;
    }

    // Realizar la reserva en el servidor
    const nuevaReserva = { dia, horario, grupo: grupoSeleccionado };

    try {
      const response = await api.post("/reservas", nuevaReserva); // Ajusta la ruta según tu backend
      setReservas(response.data);
      alert("Reserva realizada con éxito.");
    } catch (error) {
      console.error("Error al guardar reserva en el backend:", error);
      alert("No se pudo realizar la reserva. Inténtalo nuevamente.");
    }
  };


  

  const handleBorrarReservas = async () => {
    const contraseñaAdmin = prompt("Ingresa la contraseña de administrador:");
    if (contraseñaAdmin !== ADMIN_PASSWORD) {
      alert("Contraseña incorrecta. No se pueden borrar las reservas.");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas borrar todas las reservas?")) {
      try {
        await api.delete("/reservas"); // Ajusta la ruta según tu backend
        setReservas({});
        alert("Todas las reservas han sido borradas.");
      } catch (error) {
        console.error("Error al borrar reservas en el backend:", error);
        alert("No se pudieron borrar las reservas.");
      }
    }
  };

  return (
    <div className="app-container">
      <h1>Asignación de Horarios</h1>
      <p>
        Selecciona un grupo, establece su contraseña y elige los horarios
        disponibles. Haz clic en "Finalizar selección" cuando termines.
      </p>

      {/* Selección del grupo */}
      <div className="grupo-selector">
        <label>
          Selecciona tu grupo:
          <select
            value={grupoSeleccionado}
            onChange={(e) => handleSeleccionarGrupo(e.target.value)}
            disabled={grupoSeleccionado !== ""}
          >
            <option value="">-- Selecciona un Grupo --</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={`Grupo ${i + 1}`}>
                Grupo {i + 1}
              </option>
            ))}
          </select>
        </label>
        {grupoSeleccionado && (
          <button
            onClick={handleFinalizarSeleccion}
            style={{ marginLeft: "10px" }}
          >
            Finalizar selección
          </button>
        )}
      </div>

      {/* Mostrar horarios por días */}
      <div className="horarios-container">
        {fechasDias.map(({ dia, fecha }) => (
          <div key={dia} className="dia-container">
            <h2>
              {dia} - {fecha}
            </h2>
            <div className="horarios">
              {horariosPorDia[dia].map((horario) => {
                const idHorario = `${dia}-${horario}`;
                const gruposReservados = reservas[idHorario] || [];
                return (
                  <div key={idHorario} className="horario">
                    <span>{horario}</span>
                    <button
                      onClick={() => handleSeleccionarHorario(dia, horario)}
                      style={{
                        backgroundColor:
                          gruposReservados.length >= 4 ? "red" : "green",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor:
                          gruposReservados.length >= 4
                            ? "not-allowed"
                            : "pointer",
                      }}
                      disabled={gruposReservados.length >= 4}
                    >
                      {gruposReservados.length >= 4
                        ? `Lleno (${gruposReservados.length}/4)`
                        : `Seleccionar (${gruposReservados.length}/4)`}
                    </button>
                    {gruposReservados.length > 0 && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>Grupos:</strong> {gruposReservados.join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón para borrar reservas */}
      <div className="borrar-reservas">
        <button
          onClick={handleBorrarReservas}
          style={{
            marginTop: "20px",
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Borrar todas las reservas
        </button>
      </div>
    </div>
  );
};

export default App;
