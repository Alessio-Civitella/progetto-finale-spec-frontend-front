import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import type { Carne } from "../types";
import QuickViewModal from "../components/QuickViewModal";

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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCarne, setSelectedCarne] = useState<Carne | null>(null);

  const openModal = (carne: Carne) => {
    setSelectedCarne(carne);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCarne(null);
  };

  useEffect(() => {
    fetch("http://localhost:3001/carnes")
      .then((res) => res.json())
      .then((data) => {
        // Recupera le carni selezionate dal localStorage
        const savedComparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        // Inizializza lo stato checked basandosi sui dati salvati
        const initializedData = data.map((carne: Carne) => ({
          ...carne,
          checked: savedComparisons.includes(String(carne.id))
        }));
        setCarni(initializedData);
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

  const toggleCompare = (carne: Carne) => {
    const updatedCarni = carni.map(c => {
      if (c.id === carne.id) {
        return { ...c, checked: !c.checked };
      }
      return c;
    });
    setCarni(updatedCarni);
    
    const comparisons = updatedCarni.filter(c => c.checked).map(c => String(c.id));
    localStorage.setItem("comparisons", JSON.stringify(comparisons));
  };

  const filteredCarni: Carne[] = [...carni]
    .filter((carne) =>
      carne.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((carne) =>
      selectedCategory === "all" ? true : carne.category === selectedCategory
    )
    .sort((a: Carne, b: Carne) => {
      const fieldA = String(a[sortField]);
      const fieldB = String(b[sortField]);

      // Confronto alfabetico sensibile alla lingua italiana, ignorando maiuscole/minuscole
      const comparison = fieldA.localeCompare(fieldB, 'it', { sensitivity: 'base' });
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const categorieUniche = Array.from(new Set(carni.map((c) => c.category)));

  const getCarniChecked = () => carni.filter((carne) => carne.checked).map((carne) => carne.id);

  return (
    <div className="home-container">
      <div className="hero-header">
        <div className="hero-content">
          <h1>Il Paradiso della Carne</h1>
          <p>Scopri i migliori tagli, selezionati per te.</p>
        </div>
      </div>

      <div className="home-header">
        <h2>Catalogo Carni</h2>
        <div className="header-links">
          <Link to="/favourites" className="link-preferiti">Preferiti</Link>
          <Link to="/compare" className="link-confronto">Confronta ({getCarniChecked().length})</Link>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Cerca per nome..."
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
          onChange={(e) => setSortField(e.target.value as 'title' | 'category')}
        >
          <option value="title">Ordina per nome</option>
          <option value="category">Ordina per categoria</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      {loading ? (
        <p>Caricamento carni...</p>
      ) : (
        <ul className="carni-list">
          {filteredCarni.map((carne) => (
            <li key={carne.id} className="carne-item">
              <div className="carne-item-content">
                <h2>{carne.title}</h2>
                <p>Categoria: {carne.category}</p>
              </div>
              <div className="carne-item-actions">
                <button className="quick-view-button" onClick={() => openModal(carne)}>Vista Rapida</button>
                <div className="compare-checkbox">
                  <input 
                    type="checkbox" 
                    id={`compare-${carne.id}`}
                    checked={!!carne.checked}
                    disabled={getCarniChecked().length >= 2 && !carne.checked}
                    onChange={() => toggleCompare(carne)}
                  />
                  <label htmlFor={`compare-${carne.id}`}>Confronta</label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <QuickViewModal 
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        carne={selectedCarne}
        onToggleFavourite={toggleFavourite}
        isFavourite={selectedCarne ? favourites.includes(String(selectedCarne.id)) : false}
      />
    </div>
  );
}

export default Home;
