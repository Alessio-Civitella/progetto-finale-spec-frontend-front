import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Carne } from "../types";
import "./Favourites.css";

function Favourites() {
  const [carni, setCarni] = useState<Carne[]>([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favourites");
    if (saved) {
      setFavourites(JSON.parse(saved));
    }

    fetch("http://localhost:3001/carnes")
      .then((res) => res.json())
      .then((data) => {
        setCarni(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const carniPreferite = carni.filter((carne) => favourites.includes(carne.id));

  return (
    <div className="favourites-container">
      <h1>Le tue carni preferite</h1>
      <Link to="/" className="torna-alla-lista">Torna alla lista</Link>
      {loading ? (
        <p>Caricamento...</p>
      ) : carniPreferite.length === 0 ? (
        <p>Nessuna carne preferita.</p>
      ) : (
        <ul className="carni-list">
          {carniPreferite.map((carne) => (
            <li key={carne.id} className="carne-item">
              <h2>{carne.title}</h2>
              <p>Categoria: {carne.category}</p>
              <Link to={`/details/${carne.id}`}>Vedi dettagli</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favourites;
