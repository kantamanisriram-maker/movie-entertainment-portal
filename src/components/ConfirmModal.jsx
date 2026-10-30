import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  confirmText = 'Delete Permanently',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="480px">
      <div className="delete-dialog-content">
        <div className="delete-dialog-icon">
          <AlertTriangle size={32} />
        </div>
        <h4 style={{ color: '#fff', fontSize: '1.2rem', textAlign: 'center' }}>
          {itemName ? `Delete "${itemName}"?` : 'Confirm Action'}
        </h4>
        <p style={{ textAlign: 'center', fontSize: '0.92rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
            style={{ flex: 1.2 }}
          >
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
