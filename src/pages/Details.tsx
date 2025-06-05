import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Details.css";
import type { Carne } from "../types";
import { getFavourites, addFavourite, removeFavourite } from "../utils/favourites";

function Details() {
  const { id } = useParams<{ id: string }>();
  const [carne, setCarne] = useState<Carne | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/carnes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setCarne(data);
          setLoading(false);
          // Controlla se è nei preferiti
          const favs = getFavourites();
          setIsFavourite(favs.some((c) => c.id === data.id));
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const toggleFavourite = () => {
    if (!carne) return;
    if (isFavourite) {
      removeFavourite(carne.id);
      setIsFavourite(false);
    } else {
      addFavourite(carne);
      setIsFavourite(true);
    }
  };

  if (loading) return <p>Caricamento dettagli...</p>;
  if (!carne) return <p>Carne non trovata.</p>;

  return (
    <div className="details-container">
      <h1>{carne.title}</h1>
      <p><strong>Categoria:</strong> {carne.category}</p>
      <p><strong>Origine:</strong> {carne.origin}</p>
      <p><strong>Prezzo per Kg:</strong> €{carne.pricePerKg.toFixed(2)}</p>
      <p><strong>Contenuto di grassi:</strong> {carne.fatContent}%</p>
      <p><strong>Descrizione:</strong> {carne.description}</p>
      <button onClick={toggleFavourite} style={{ marginBottom: "1rem" }}>
        {isFavourite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      </button>
      <br />
      <Link to="/">Torna alla lista</Link>
    </div>
  );
}

export default Details;
