import { useState } from 'react';
import '../styles/AdminSettings.css';

export default function AdminSettings() {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem('adminToken');

      const res = await fetch(
        `${API_URL}/api/admin/change-credentials`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword,
            newUsername,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessage('Credentials updated successfully');

      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="settings-page">

      <form
        className="settings-form"
        onSubmit={handleSubmit}
      >

        <h2>Admin Settings</h2>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="New Username"
          value={newUsername}
          onChange={(e) =>
            setNewUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <button type="submit">
          Update Credentials
        </button>

        {message && (
          <p className="settings-message">
            {message}
          </p>
        )}

      </form>
    </div>
  );
}