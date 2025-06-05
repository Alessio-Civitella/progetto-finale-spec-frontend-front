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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<"title" | "category">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  const filteredCarni = carni
    .filter((carne) =>
      carne.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((carne) =>
      selectedCategory === "all" ? true : carne.category === selectedCategory
    )
    .sort((a, b) => {
      const fieldA = String(a[sortField]).toLowerCase();
      const fieldB = String(b[sortField]).toLowerCase();
      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const categorieUniche = Array.from(new Set(carni.map((c) => c.category)));

  return (
    <div className="home-container">
      <h1>Lista delle carni</h1>
      <Link to="/favourites" className="link-preferiti">Vai ai preferiti</Link>

      <div className="filters">
        <input
          type="text"
          placeholder="Cerca per titolo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Tutte le categorie</option>
          {categorieUniche.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as "title" | "category")}
        >
          <option value="title">Ordina per titolo</option>
          <option value="category">Ordina per categoria</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul className="carni-list">
          {filteredCarni.map((carne) => (
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
