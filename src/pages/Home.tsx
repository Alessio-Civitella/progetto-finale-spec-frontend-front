import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export type Carne = {
  id: string;
  title: string;
  category: string;
  origin: string;
  pricePerKg: number;
  fatContent: number;
  description: string;
};

function Home() {
  const [carni, setCarni] = useState<Carne[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/carnes')
      .then((res) => res.json())
      .then((data) => {
        setCarni(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Lista delle carni</h1>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul className="carne-list">
          {carni.map((carne) => (
            <li key={carne.id} className="carne-item">
              <h2>{carne.title}</h2>
              <p>Categoria: {carne.category}</p>
              <Link to={`/details/${carne.id}`} className="carne-link">
                Vedi dettagli
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;

