import { useState } from 'react';
import './ReportModal.css';

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harcèlement' },
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'off_topic', label: 'Hors sujet' },
  { value: 'other', label: 'Autre' }
];

export default function ReportModal({ isOpen, onClose, onSubmit, type, refId }) {
  const [reason, setReason] = useState('spam');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ type, refId, reason, comment: comment.trim() || undefined });
      setReason('spam');
      setComment('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal-header">
          <h3>Signaler ce contenu</h3>
          <button type="button" className="report-modal-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="report-modal-form">
          <label>
            Motif du signalement
            <select value={reason} onChange={(e) => setReason(e.target.value)} required>
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
          <label>
            Détails (optionnel)
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Précisez si besoin..."
              maxLength={500}
              rows={3}
            />
          </label>
          <div className="report-modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Envoi...' : 'Envoyer le signalement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
