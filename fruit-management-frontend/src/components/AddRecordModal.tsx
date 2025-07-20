import React, { useState, useEffect } from 'react';
import { FruitRecord, CreateFruitRequest } from '../types';
import { fruitAPI } from '../services/api';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingFruit?: FruitRecord | null;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFruit,
}) => {
  const [formData, setFormData] = useState<CreateFruitRequest>({
    date: '',
    productName: '',
    color: '',
    amount: 0,
    unit: 0,
  });
  const [validFruits, setValidFruits] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [allColors] = useState<string[]>([
  'Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple', 
  'Pink', 'Brown', 'White', 'Black', 'Gray'
  ]);

  const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // แปลงเป็น Date object ทุกกรณี
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.log('Invalid date:', dateString);
      return '';
    }
    
    // แปลงเป็น YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const result = `${year}-${month}-${day}`;
    console.log('Date converted:', dateString, '->', result);
    return result;
    
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

  const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // แปลงเป็น Date object ก่อน
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // แปลงเป็น dd-mm-yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
    
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return dateString;
  }
};

  useEffect(() => {
    if (isOpen) {
      loadValidFruits();
      if (editingFruit) {
        setFormData({
          date: formatDateForInput(editingFruit.date),
          productName: editingFruit.productName,
          color: editingFruit.color,
          amount: editingFruit.amount,
          unit: editingFruit.unit,
        });
        setAvailableColors(allColors);
        // loadColorsForFruit(editingFruit.productName);
      } else {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          productName: '',
          color: '',
          amount: 0,
          unit: 0,
        });
        setAvailableColors([]);
      }
    }
  }, [isOpen, editingFruit]);

  const loadValidFruits = async () => {
    try {
      const response = await fruitAPI.getValidFruits();
      setValidFruits(response.fruits);
    } catch (error) {
      console.error('Error loading valid fruits:', error);
    }
  };

  const loadColorsForFruit = async (fruitName: string) => {
    if (!fruitName) {
      setAvailableColors([]);
      return;
    }
    try {
      const response = await fruitAPI.getColorsForFruit(fruitName);
      setAvailableColors(response.colors);
    } catch (error) {
      console.error('Error loading colors:', error);
      setAvailableColors([]);
    }
  };

  const handleFruitChange = (fruitName: string) => {
    setFormData({ ...formData, productName: fruitName, color: '' });
    setAvailableColors(allColors);
    // loadColorsForFruit(fruitName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingFruit) {
        await fruitAPI.update(editingFruit.id, formData);
      } else {
        await fruitAPI.create(formData);
      }
      onSave();
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save fruit');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '2rem',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#1f2937',
    },
    inputGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '1rem',
      boxSizing: 'border-box' as const,
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '1rem',
      boxSizing: 'border-box' as const,
      backgroundColor: 'white',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1.5rem',
    },
    button: {
      flex: 1,
      padding: '0.75rem',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
    },
    saveBtn: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    cancelBtn: {
      backgroundColor: '#6b7280',
      color: 'white',
    },
    error: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
    },
    calculated: {
      backgroundColor: '#f3f4f6',
      padding: '0.75rem',
      borderRadius: '4px',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
    },
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>
          {editingFruit ? 'Edit Fruit Record' : 'Add New Fruit Record'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Date</label>
            {editingFruit ? (
              // แสดงเป็น text สำหรับ edit mode
              <div style={{
                ...styles.input,
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
              }}>
                {formatDateForDisplay(editingFruit.date)}
              </div>
            ) : (
              // แสดงเป็น input สำหรับ add mode
              <input
                type="date"
                value={formData.date} // ใช้ formData.date ที่เป็น YYYY-MM-DD
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={styles.input}
                required
              />
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Name</label>
            <select
              value={formData.productName}
              onChange={(e) => handleFruitChange(e.target.value)}
              style={styles.select}
              required
              disabled={!!editingFruit}
            >
              <option value="">Select a fruit</option>
              {validFruits.map((fruit) => (
                <option key={fruit} value={fruit}>
                  {fruit}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Color</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              style={styles.select}
              required
              disabled={!formData.productName}
            >
              <option value="">Select a color</option>
              {availableColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              style={styles.input}
              required
              min="0"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Unit</label>
            <input
              type="number"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: parseInt(e.target.value) || 0 })}
              style={styles.input}
              required
              min="0"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Total (Calculated)</label>
            <div style={styles.calculated}>
              {(formData.amount * formData.unit).toFixed(2)}
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.button, ...styles.cancelBtn }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ ...styles.button, ...styles.saveBtn }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;