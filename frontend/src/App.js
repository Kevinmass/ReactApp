import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error('Health check failed');
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Users fetch failed');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHealth();
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUserName.trim()) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName, role: newUserRole })
      });
      if (!res.ok) throw new Error('Failed to create user');
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      setNewUserName('');
      setNewUserRole('user');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App" style={{
      padding: 24,
      maxWidth: 800,
      margin: '0 auto',
      background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #c7ceea, #86a8e7)',
      minHeight: '100vh',
      borderRadius: 16,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        marginBottom: 24,
        fontSize: '2.5em'
      }}>TP05 CI/CD - Kevin y Octavio</h1>
      {error && (
        <div style={{
          background: 'rgba(255, 87, 87, 0.8)',
          color: '#fff',
          padding: 12,
          borderRadius: 8,
          marginBottom: 24
        }}>
          Error: {error}
        </div>
      )}
      <section style={{
        marginTop: 16,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 12
      }}>
        <h2 style={{ color: '#ff6b6b', marginBottom: 12 }}>Health</h2>
        <pre style={{
          textAlign: 'left',
          background: '#2d3436',
          color: '#00b894',
          padding: 12,
          borderRadius: 8,
          fontSize: '14px'
        }}>
{health ? JSON.stringify(health, null, 2) : 'Cargando...'}
        </pre>
      </section>
      <section style={{
        marginTop: 24,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 12
      }}>
        <h2 style={{ color: '#fd79a8', marginBottom: 12 }}>Usuarios</h2>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ color: '#6c5ce7', marginBottom: 8 }}>Agregar Nuevo Usuario</h3>
          <input
            type="text"
            placeholder="Nombre del usuario"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            style={{
              padding: 8,
              marginRight: 8,
              borderRadius: 4,
              border: '1px solid #ddd'
            }}
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            style={{
              padding: 8,
              marginRight: 8,
              borderRadius: 4,
              border: '1px solid #ddd'
            }}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button
            onClick={handleCreateUser}
            style={{
              padding: 8,
              background: 'linear-gradient(90deg, #fd79a8, #fdcb6e)',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Agregar Usuario
          </button>
        </div>
        {users.length === 0 ? (
          <p>No hay usuarios para mostrar.</p>
        ) : (
          <ul style={{
            textAlign: 'left',
            listStyle: 'none',
            padding: 0
          }}>
            {users.map((u) => (
              <li key={u.id} style={{
                background: 'linear-gradient(90deg, #74b9ff, #a29bfe)',
                color: '#fff',
                padding: 10,
                borderRadius: 6,
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>#{u.id}</strong> - {u.name} <em>({u.role})</em></span>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  style={{
                    padding: 6,
                    background: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
