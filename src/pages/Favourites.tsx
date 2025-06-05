import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favourites.css";
import type { Carne } from "../types"

function Favourites() {
  const [favourites, setFavourites] = useState<Carne[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favourites");
    if (saved) {
      setFavourites(JSON.parse(saved));
    }
  }, []);

  const removeFavourite = (id: string) => {
    const updated = favourites.filter((carne) => carne.id !== id);
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  if (favourites.length === 0) {
    return <p>Non hai carni preferite.</p>;
  }

  return (
    <div className="favourites-container">
      <h1>Carni Preferite</h1>
      <ul>
        {favourites.map((carne) => (
          <li key={carne.id} className="favourite-item">
            <Link to={`/details/${carne.id}`}>{carne.title}</Link>
            <button onClick={() => removeFavourite(carne.id)}>Rimuovi</button>
          </li>
        ))}
      </ul>
      <Link to="/">Torna alla lista</Link>
    </div>
  );
}

export default Favourites;
