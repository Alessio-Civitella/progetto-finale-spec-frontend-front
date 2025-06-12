import React from 'react';
import Modal from 'react-modal';
import type { Carne } from '../types';
import './QuickViewModal.css';

interface QuickViewModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  carne: Carne | null;
  onToggleFavourite: (id: string) => void;
  isFavourite: boolean;
}

// Imposta l'elemento radice dell'app per l'accessibilità del modale
Modal.setAppElement('#root');

const QuickViewModal: React.FC<QuickViewModalProps> = ({ 
  isOpen, 
  onRequestClose, 
  carne, 
  onToggleFavourite,
  isFavourite
}) => {
  if (!carne) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Vista Rapida Prodotto"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button onClick={onRequestClose} className="close-button">&times;</button>
      <h2>{carne.title}</h2>
      <div className="modal-body">
        <p><strong>Categoria:</strong> {carne.category}</p>
        <p><strong>Origine:</strong> {carne.origin}</p>
        <p><strong>Prezzo al Kg:</strong> €{carne.pricePerKg.toFixed(2)}</p>
        <p><strong>Contenuto di grassi:</strong> {carne.fatContent}%</p>
        <p className="description">{carne.description}</p>
      </div>
      <div className="modal-actions">
        <button 
          className={`favourite-button ${isFavourite ? 'favourited' : ''}`}
          onClick={() => onToggleFavourite(String(carne.id))}
        >
          {isFavourite ? 'Rimuovi dai Preferiti' : 'Aggiungi ai Preferiti'}
        </button>

      </div>
    </Modal>
  );
};

export default QuickViewModal;
