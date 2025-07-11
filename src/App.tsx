
import { useEffect, useState } from 'react';
import './index.css';

const App = () => {
  const [coins, setCoins] = useState(0);
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const API_BASE = 'https://your-backend-url.com'; // replace this with real backend

  // Register user and fetch info
  useEffect(() => {
    const tg = window.Telegram?.WebApp?.initDataUnsafe;
    const id = tg?.user?.id?.toString();
    const name = tg?.user?.username;

    if (id && name) {
      setTelegramId(id);
      setUsername(name);

      fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id: id, username: name })
      });

      fetch(`${API_BASE}/user/${id}`)
        .then(res => res.json())
        .then(data => setCoins(data.coins || 0));

      fetch(`${API_BASE}/leaderboard`)
        .then(res => res.json())
        .then(data => setLeaderboard(data));
    }
  }, []);

  const handleTap = async () => {
    if (!telegramId) return;
    await fetch(`${API_BASE}/tap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: telegramId, amount: 1 })
    });
    setCoins(prev => prev + 1);
  };

  const handleBonus = async () => {
    if (!telegramId) return;
    const res = await fetch(`${API_BASE}/bonus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: telegramId })
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Bonus claimed!");
      setCoins(prev => prev + 20);
    } else {
      setMessage(data.message || "Bonus already claimed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>👤 {username}</h1>
      <h2>💰 Coins: {coins}</h2>

      <button onClick={handleTap} style={{ marginTop: 10 }}>🚀 Tap to earn</button>
      <button onClick={handleBonus} style={{ marginLeft: 10 }}>🎁 Daily Bonus</button>
      <p>{message}</p>

      <h3>🏆 Leaderboard</h3>
      <ul>
        {leaderboard.map((user: any, i) => (
          <li key={i}>{user.username || 'User'} - {user.coins} coins</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
