import React from 'react';
import { FaExclamationTriangle, FaTimes, FaTrash, FaCheck } from 'react-icons/fa';
import '../Styles/ConfirmModal.css';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <button className="confirm-modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className={`confirm-modal-icon ${type}`}>
                    {type === 'danger' ? <FaExclamationTriangle /> : <FaCheck />}
                </div>

                <h2 className="confirm-modal-title">{title}</h2>
                <p className="confirm-modal-message">{message}</p>

                <div className="confirm-modal-actions">
                    <button
                        className="confirm-btn confirm-btn-cancel"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`confirm-btn confirm-btn-${type}`}
                        onClick={handleConfirm}
                    >
                        {type === 'danger' && <FaTrash />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
