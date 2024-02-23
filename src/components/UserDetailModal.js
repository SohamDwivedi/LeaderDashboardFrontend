import React from 'react';
import Modal from 'react-modal';

const UserDetailModal = ({ user, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2>User Details</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Points:</strong> {user.points}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
};

export default UserDetailModal;
