import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import type { Carne } from "../types";

function Home() {
  const [carni, setCarni] = useState<Carne[]>([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch("http://localhost:3001/carnes")
      .then((res) => res.json())
      .then((data) => {
        setCarni(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleFavourite = (id: string) => {
    const updated = favourites.includes(id)
      ? favourites.filter((favId) => favId !== id)
      : [...favourites, id];

    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  return (
    <div className="home-container">
      <h1>Lista delle carni</h1>
      <Link to="/favourites" className="link-preferiti">Vai ai preferiti</Link>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul className="carni-list">
          {carni.map((carne) => (
            <li key={carne.id} className="carne-item">
              <h2>{carne.title}</h2>
              <p>Categoria: {carne.category}</p>
              <Link to={`/details/${carne.id}`}>Vedi dettagli</Link>
              <button
                className="favourite-button"
                onClick={() => toggleFavourite(carne.id)}
              >
                {favourites.includes(carne.id)
                  ? "Rimuovi dai preferiti"
                  : "Aggiungi ai preferiti"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
