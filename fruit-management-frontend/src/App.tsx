import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import DataGrid from './components/DataGrid';
import AddRecordModal from './components/AddRecordModal';
import { FruitRecord } from './types';

function App() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFruit, setEditingFruit] = useState<FruitRecord | null>(null);
  const [refreshGrid, setRefreshGrid] = useState(false);

  const handleAddNew = () => {
    setEditingFruit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fruit: FruitRecord) => {
    setEditingFruit(fruit);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFruit(null);
  };

  const handleSave = () => {
    setRefreshGrid(!refreshGrid); // Toggle to trigger refresh
  };

  const handleDelete = (id: string) => {
    // Delete is handled in DataGrid component
    setRefreshGrid(!refreshGrid); // Toggle to trigger refresh
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
    },
    header: {
      backgroundColor: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    welcome: {
      color: '#6b7280',
    },
    button: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    addBtn: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    logoutBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    content: {
      padding: '2rem',
    },
    loading: {
      textAlign: 'center' as const,
      paddingTop: '10rem',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🍎 Fruit Management System</h1>
        <div style={styles.userInfo}>
          <button
            style={{ ...styles.button, ...styles.addBtn }}
            onClick={handleAddNew}
          >
            + Add New Record
          </button>
          <span style={styles.welcome}>Welcome, {user?.username}!</span>
          <button style={{ ...styles.button, ...styles.logoutBtn }} onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      
      <main style={styles.content}>
        <DataGrid
          onEdit={handleEdit}
          onDelete={handleDelete}
          refresh={refreshGrid}
        />
      </main>

      <AddRecordModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        editingFruit={editingFruit}
      />
    </div>
  );
}

export default App;