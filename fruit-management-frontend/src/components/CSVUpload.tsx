import React, { useState } from 'react';
import api from '../services/api';

interface CSVUploadProps {
  onUploadComplete: () => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await api.post('/csv/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      setFile(null);
      onUploadComplete();
      
      // Reset file input
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Upload error:', error);
      setResult({
        error: error.response?.data?.error || 'Upload failed',
        details: error.response?.data?.details,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL fruit data? This cannot be undone!')) {
      return;
    }

    setUploading(true);
    try {
      await api.delete('/csv/clear');
      setResult({ message: 'All data cleared successfully' });
      onUploadComplete();
    } catch (error: any) {
      setResult({ error: 'Failed to clear data' });
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '1rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1f2937',
    },
    uploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '6px',
      padding: '2rem',
      textAlign: 'center' as const,
      marginBottom: '1rem',
    },
    fileInput: {
      marginBottom: '1rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    button: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    uploadBtn: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    clearBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    disabledBtn: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
    result: {
      padding: '1rem',
      borderRadius: '4px',
      marginTop: '1rem',
    },
    success: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #10b981',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #ef4444',
    },
    info: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📁 CSV Data Management</h3>
      
      <div style={styles.uploadArea}>
        <p>📊 Upload CSV file to import fruit data</p>
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={styles.fileInput}
          disabled={uploading}
        />
        {file && (
          <p style={styles.info}>
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            ...styles.button,
            ...((!file || uploading) ? styles.disabledBtn : styles.uploadBtn),
          }}
        >
          {uploading ? '⏳ Processing...' : '📤 Upload & Import'}
        </button>
        
        <button
          onClick={handleClearAll}
          disabled={uploading}
          style={{
            ...styles.button,
            ...(uploading ? styles.disabledBtn : styles.clearBtn),
          }}
        >
          🗑️ Clear All Data
        </button>
      </div>

      {result && (
        <div style={{
          ...styles.result,
          ...(result.error ? styles.error : styles.success),
        }}>
          {result.error ? (
            <div>
              <p><strong>❌ Error:</strong> {result.error}</p>
              {result.details && <p>{result.details}</p>}
            </div>
          ) : (
            <div>
              <p><strong>✅ Success:</strong> {result.message}</p>
              {result.totalRows && (
                <div style={styles.info}>
                  <p>📊 Total rows: {result.totalRows}</p>
                  <p>✅ Success: {result.successCount}</p>
                  {result.errorCount > 0 && (
                    <p>❌ Errors: {result.errorCount}</p>
                  )}
                  {result.errors && result.errors.length > 0 && (
                    <div>
                      <p><strong>Error details:</strong></p>
                      <ul>
                        {result.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CSVUpload;