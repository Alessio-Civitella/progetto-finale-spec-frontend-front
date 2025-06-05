import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import type { Carne } from "../types";
import { getFavourites, addFavourite, removeFavourite } from "../utils/favourites";

function Home() {
  const [carni, setCarni] = useState<Carne[]>([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/carnes")
      .then((res) => res.json())
      .then((data) => {
        setCarni(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const favs = getFavourites().map((c) => c.id);
    setFavourites(favs);
  }, []);

  const toggleFavourite = (id: string) => {
  if (favourites.includes(id)) {
    setFavourites(favourites.filter((favId) => favId !== id));
  } else {
    setFavourites([...favourites, id]);
  }
};


  return (
    <div className="home-container">
      <h1>Lista delle carni</h1>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul className="carni-list">
          {carni.map((carne) => (
            <li key={carne.id} className="carne-item">
              <h2>{carne.title}</h2>
              <p>Categoria: {carne.category}</p>
              <Link to={`/details/${carne.id}`}>Vedi dettagli</Link>
              <button onClick={() => toggleFavourite(carne.id)}>
                {favourites.includes(carne.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
