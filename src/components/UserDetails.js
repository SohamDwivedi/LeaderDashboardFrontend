import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserDetailModal from './UserDetailModal';
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
const UserDetails = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserAge, setNewUserAge] = useState('');
    const [newUserPoints, setNewUserPoints] = useState(0);
    const [newUserAddress, setNewUserAddress] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortByName, setSortByName] = useState(null);
    const [sortByPoints, setSortByPoints] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        axios.get('http://localhost:8000/api/users') // Assuming your Laravel API is running on port 8000
            .then(response => {
                const sortedUsers = response.data.sort((a, b) => b.points - a.points);
                setUsers(sortedUsers);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            }).finally(() => {
                setIsLoading(false);
            });
        setIsLoading(true);
        axios.get('http://localhost:8000/api/users-grouped-by-score') // Assuming your Laravel API is running on port 8000
            .then(response => {
                // const sortedUsers = response.data.sort((a, b) => b.points - a.points);
                // setUsers(sortedUsers);
                console.log(response)
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handlePlus = (id) => {
        setIsLoading(true);
        axios.put(`http://localhost:8000/api/users/${id}/increment`)
            .then(response => {
                const updatedUsers = users.map(user => {
                    if (user.id === id) {
                        return { ...user, points: response.data.points };
                    }
                    return user;
                });
                const sortedUsers = updatedUsers.sort((a, b) => b.points - a.points);
                setUsers(sortedUsers);
            })
            .catch(error => {
                console.error('Error incrementing points:', error);
            }).finally(() => {
                setIsLoading(false);
            });
    };
    
    const handleMinus = (id) => {
        setIsLoading(true);
        axios.put(`http://localhost:8000/api/users/${id}/decrement`)
            .then(response => {
                const updatedUsers = users.map(user => {
                    if (user.id === id) {
                        return { ...user, points: response.data.points };
                    }
                    return user;
                });
                const sortedUsers = updatedUsers.sort((a, b) => b.points - a.points);
                setUsers(sortedUsers);
            })
            .catch(error => {
                console.error('Error decrementing points:', error);
            }).finally(() => {
                setIsLoading(false);
            });
    };
    

    const handleDelete = (id) => {
        setIsLoading(true);
        axios.delete(`http://localhost:8000/api/users/${id}`)
            .then(() => {
                const updatedUsers = users.filter(user => user.id !== id);
                const sortedUsers = updatedUsers.sort((a, b) => b.points - a.points);
                setUsers(sortedUsers);
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            }).finally(() => {
                setIsLoading(false);
            });
    };
    
    const openModal = (user) => {
        setSelectedUser(user);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedUser(null);
    };

    const handleAddUser = () => {
        const newUser = {
            name: newUserName,
            age: newUserAge,
            points: newUserPoints,
            address: newUserAddress,
        };
        setIsLoading(true);
        axios.post('http://localhost:8000/api/users', newUser)
            .then(response => {
                const updatedUsers = [...users, response.data];
                const sortedUsers = updatedUsers.sort((a, b) => b.points - a.points);
                setUsers(sortedUsers);
                closeAddModal();
            })
            .catch(error => {
                console.error('Error adding user:', error);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const openAddModal = () => {
        setModalAddIsOpen(true);
    };

    const closeAddModal = () => {
        setModalAddIsOpen(false);
        setNewUserName('');
        setNewUserAge('');
        setNewUserPoints(0);
        setNewUserAddress('');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortByName = () => {
        if (sortByName === 'asc') {
            setSortByName('desc');
        } else {
            setSortByName('asc');
        }
        const sortedUsers = [...users].sort((a, b) => {
            if (sortByName === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setUsers(sortedUsers);
    };

    const handleSortByPoints = () => {
        if (sortByPoints === 'asc') {
            setSortByPoints('desc');
        } else {
            setSortByPoints('asc');
        }
        const sortedUsers = [...users].sort((a, b) => {
            if (sortByPoints === 'asc') {
                return a.points - b.points;
            } else {
                return b.points - a.points;
            }
        });
        setUsers(sortedUsers);
    };

    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>{isLoading ? (<div className="loader">
            <ClipLoader color="#000" loading={isLoading} size={50} />
        </div>)
        :
        (<div>
            <h3>Leader Board</h3>
            <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearch} />
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th onClick={handleSortByName} style={{cursor:'pointer'}}>Name {sortByName === 'asc'?'↓':'↑'}</th>
                        <th></th>
                        <th></th>
                        <th onClick={handleSortByPoints} style={{cursor:'pointer'}}>Points {sortByPoints === 'asc'?'↓':'↑'}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td><button onClick={() => handleDelete(user.id)}><b><i className="fas fa-times"/></b></button></td>
                            <td><span onClick={() => openModal(user)}>{user.name}</span></td>
                            <td><button onClick={() => handlePlus(user.id)}><b><i className="fas fa-plus"/></b></button></td>
                            <td><button onClick={() => handleMinus(user.id)}><b><i className="fas fa-minus"/></b></button></td>
                            <td>{user.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <ul style={{listStyleType: 'none'}}>
                {users.map(user => (
                    <li key={user.id}>
                        <button onClick={() => handleDelete(user.id)}><b><i className="fas fa-times"/></b></button>
                        <span onClick={() => openModal(user)}>{user.name}</span>
                        <button onClick={() => handlePlus(user.id)}><b><i className="fas fa-plus"/></b></button>
                        <button onClick={() => handleMinus(user.id)}><b><i className="fas fa-minus"/></b></button>&nbsp;
                        {user.points} {' Points'}<br />
                    </li>
                ))}
            </ul> */}
            <br/>
            <button onClick={openAddModal}><i className="fas fa-plus"/> Add User</button>
            {modalIsOpen && <UserDetailModal user={selectedUser} isOpen={modalIsOpen} onClose={closeModal} />}

            {modalAddIsOpen && <Modal
                isOpen={modalAddIsOpen}
                onRequestClose={closeAddModal}
            >
                <h2>Add User</h2>
                <label>Name:</label>
                <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} /><br />
                <label>Age:</label>
                <input type="number" value={newUserAge} onChange={(e) => setNewUserAge(e.target.value)} min={0}/><br />
                <label>Points:</label>
                <input type="number" value={newUserPoints} onChange={(e) => setNewUserPoints(e.target.value)} min={0}/><br />
                <label>Address:</label>
                <input type="text" value={newUserAddress} onChange={(e) => setNewUserAddress(e.target.value)} /><br />
                <button onClick={handleAddUser}>Submit</button>
                <button onClick={closeAddModal}>Close</button>
            </Modal>}
        </div>)
        }</>
    );
};

export default UserDetails;
