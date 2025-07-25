import "../styles/tarjetas.css";
import { buildFileUrl } from "@helpers/urlHelper";

const TarjetasUsuario = ({ reuniones }) => {
  if (!reuniones || reuniones.length === 0) {
    return <p>No hay reuniones disponibles.</p>;
  }

  return (
    <div className="card-grid">
      {reuniones.map((r) => (
        <div className="card" key={r.id}>
          <h3>{r.nombre}</h3>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(r.fecha).toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p><strong>Lugar:</strong> {r.lugar || "—"}</p>
          <p>{r.descripcion || "Sin descripción."}</p>
          {r.acta ? (
            <a
              href={buildFileUrl(r.acta)}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-link"
              aria-label="Descargar acta en PDF"
            >
              📄 Descargar acta
            </a>
          ) : (
            <p className="pending">Acta no disponible</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TarjetasUsuario;
