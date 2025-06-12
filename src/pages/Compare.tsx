import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Carne } from "../types";
import "./compare.css";

function Compare() {
  const [selectedCarni, setSelectedCarni] = useState<Carne[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSelectedCarni = async () => {
      try {
        // Recupera gli ID delle carni selezionate dal localStorage
        const savedIds = JSON.parse(localStorage.getItem("comparisons") || "[]");
        
        if (savedIds.length === 0) {
          setLoading(false);
          return;
        }

        // Carica i dati delle carni dal server
        const response = await fetch("http://localhost:3001/carnes");
        const allCarni = await response.json();
        
        // Filtra solo le carni selezionate
        const selected = allCarni.filter((carne: Carne) => 
          savedIds.includes(String(carne.id))
        );
        
        setSelectedCarni(selected);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedCarni();
  }, []);

  if (loading) {
    return (
      <div className="compare-container">
        <h1>Confronto Carni</h1>
        <p>Caricamento...</p>
      </div>
    );
  }

  if (selectedCarni.length === 0) {
    return (
      <div className="compare-container">
        <h1>Confronto Carni</h1>
        <p>Nessuna carne selezionata per il confronto.</p>
        <Link to="/" className="back-link">Torna alla lista</Link>
      </div>
    );
  }

  return (
    <div className="compare-container">
      <div className="compare-header">
        <h1>Confronto Carni</h1>
        <Link to="/" className="back-link">Torna alla lista</Link>
      </div>

      <div className="comparison-grid">
        {selectedCarni.map((carne) => (
          <div key={carne.id} className="comparison-card">
            <h2>{carne.title}</h2>
            <div className="comparison-details">
              <div className="detail-row">
                <span className="label">Categoria:</span>
                <span className="value">{carne.category}</span>
              </div>
              <div className="detail-row">
                <span className="label">Origine:</span>
                <span className="value">{carne.origin}</span>
              </div>
              <div className="detail-row">
                <span className="label">Prezzo al Kg:</span>
                <span className="value">€{carne.pricePerKg?.toFixed(2) || 'N/D'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Contenuto di Grassi:</span>
                <span className="value">{carne.fatContent ? `${carne.fatContent}%` : 'N/D'}</span>
              </div>
              {carne.description && (
                <div className="detail-row description">
                  <span className="label">Descrizione:</span>
                  <p className="value">{carne.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Compare;
