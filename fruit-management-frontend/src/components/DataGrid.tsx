import React, { useState, useEffect } from 'react';
import { fruitAPI } from '../services/api';
import { FruitRecord, PaginatedResponse } from '../types';

interface DataGridProps {
  onEdit: (fruit: FruitRecord) => void;
  onDelete: (id: string) => void;
  refresh: boolean;
}

const DataGrid: React.FC<DataGridProps> = ({ onEdit, onDelete, refresh }) => {
  const [data, setData] = useState<PaginatedResponse<FruitRecord> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fruitAPI.getAll(page, limit, search || undefined);
      setData(response);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, refresh]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleClearSearch = () => {
  setSearch('');
  setPage(1);
  // Load data without search term
  loadDataWithoutSearch();
  };

  const loadDataWithoutSearch = async () => {
    try {
      setLoading(true);
      const response = await fruitAPI.getAll(1, limit); // No search parameter
      setData(response);
      setPage(1);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        await fruitAPI.delete(id);
        loadData(); // Reload data after delete
      } catch (error) {
        console.error('Error deleting fruit:', error);
        alert('Failed to delete fruit');
      }
    }
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    header: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem',
    },
    searchForm: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    searchInput: {
      flex: 1,
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
    },
    searchBtn: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    summary: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    tableContainer: {
      overflowX: 'auto' as const,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      backgroundColor: '#f9fafb',
      padding: '0.75rem',
      textAlign: 'left' as const,
      borderBottom: '1px solid #e5e7eb',
      fontWeight: '600',
      color: '#374151',
    },
    td: {
      padding: '0.75rem',
      borderBottom: '1px solid #e5e7eb',
    },
    actionBtn: {
      padding: '0.25rem 0.5rem',
      margin: '0 0.25rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
    editBtn: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    pagination: {
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #e5e7eb',
    },
    pageBtn: {
      padding: '0.5rem 0.75rem',
      margin: '0 0.25rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    currentPageBtn: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: '1px solid #3b82f6',
    },
    loading: {
      textAlign: 'center' as const,
      padding: '2rem',
      color: '#6b7280',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

    const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // ถ้าเป็น ISO string หรือ timestamp
      const date = new Date(dateString);
      
      // ตรวจสอบว่าเป็น valid date หรือไม่
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', dateString);
        return '';
      }
      
      // แปลงเป็น YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Fruit Records</h3>
        
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by product name, color, or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>
            Search
          </button>
          {search && (
            <button 
              type="button" 
              onClick={handleClearSearch}
              style={{...styles.searchBtn, backgroundColor: '#6b7280'}}
            >
              ✕ Clear
            </button>
          )}
        </form>

        {data && (
          <div style={styles.summary}>
            Showing {data.data.length} of {data.total} records
            {data.grandTotal && (
              <span> • Grand Total: {data.grandTotal.toFixed(2)}</span>
            )}
          </div>
        )}
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Product Name</th>
              <th style={styles.th}>Color</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((fruit) => (
              <tr key={fruit.id}>
                <td style={styles.td}>{formatDateForInput(fruit.date)}</td>
                <td style={styles.td}>{fruit.productName}</td>
                <td style={styles.td}>{fruit.color}</td>
                <td style={styles.td}>{fruit.amount.toFixed(2)}</td>
                <td style={styles.td}>{fruit.unit}</td>
                <td style={styles.td}>{fruit.total.toFixed(2)}</td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionBtn, ...styles.editBtn }}
                    onClick={() => onEdit(fruit)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                    onClick={() => handleDelete(fruit.id, fruit.productName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div style={styles.pagination}>
          <div>
            Page {data.page} of {data.totalPages}
          </div>
          <div>
            <button
              style={styles.pageBtn}
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                style={{
                  ...styles.pageBtn,
                  ...(pageNum === page ? styles.currentPageBtn : {}),
                }}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              style={styles.pageBtn}
              onClick={() => setPage(page + 1)}
              disabled={page >= data.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGrid;