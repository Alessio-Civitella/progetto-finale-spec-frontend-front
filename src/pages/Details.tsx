import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Details.css";
import type { Carne } from "../types";

function Details() {
  const { id } = useParams<{ id: string }>();
  const [carne, setCarne] = useState<Carne | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/carnes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const carneData = (data && (data as any).carne) ? (data as any).carne : data;
          setCarne(carneData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

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
      <br />
      <Link to="/">Torna alla lista</Link>
    </div>
  );
}

export default Details;
