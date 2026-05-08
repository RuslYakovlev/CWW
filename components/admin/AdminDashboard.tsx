import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sermons, setSermons] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ youtubeChannelUrl: '' });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [syncingYoutube, setSyncingYoutube] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    Promise.all([
      fetch('/api/sermons').then(res => res.json()),
      fetch('/api/events').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([sermonsData, eventsData, settingsData]) => {
      setSermons(Array.isArray(sermonsData) ? sermonsData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      if (settingsData && !settingsData.error) {
        setSettings(settingsData);
      }
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem('adminToken');
      navigate('/admin');
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const deleteSermon = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/sermons/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setSermons(sermons.filter(s => s.id !== id));
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const token = localStorage.getItem('adminToken');
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      alert('Settings saved successfully');
    } catch (error) {
      alert('Failed to save settings');
    }
    setSavingSettings(false);
  };

  const syncYoutube = async () => {
    setSyncingYoutube(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('/api/youtube/sync', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Sync failed');

      const [sermonsData, settingsData] = await Promise.all([
        fetch('/api/sermons').then(res => res.json()),
        fetch('/api/settings').then(res => res.json()),
      ]);
      setSermons(Array.isArray(sermonsData) ? sermonsData : []);
      if (settingsData && !settingsData.error) setSettings(settingsData);
      alert(`YouTube sync complete: ${result.created} new, ${result.updated} updated`);
    } catch (error) {
      alert(`YouTube sync failed: ${String(error)}`);
    }
    setSyncingYoutube(false);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-serif font-medium text-text">Admin Dashboard</h1>
          <button onClick={handleLogout} className="px-6 py-2 bg-text text-white rounded-full text-sm uppercase tracking-widest hover:bg-text/80 transition-colors">
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Sermons Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-medium">Sermons</h2>
              <button onClick={() => navigate('/admin/sermons/new')} className="text-accent font-bold uppercase text-xs tracking-widest">+ Add New</button>
            </div>
            <div className="space-y-4">
              {sermons.map(sermon => (
                <div key={sermon.id} className="flex justify-between items-center p-4 bg-secondary/30 rounded-2xl">
                  <div>
                    <h3 className="font-bold text-text">{sermon.title}</h3>
                    <p className="text-sm text-text/60">{sermon.speaker}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/admin/sermons/${sermon.id}`)} className="text-blue-500 text-sm">Edit</button>
                    <button onClick={() => deleteSermon(sermon.id)} className="text-red-500 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-medium">Upcoming Event</h2>
            </div>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="flex justify-between items-center p-4 bg-secondary/30 rounded-2xl">
                  <div>
                    <h3 className="font-bold text-text">{event.title}</h3>
                    <p className="text-sm text-text/60">{event.subtitle}</p>
                  </div>
                  <button onClick={() => navigate(`/admin/events/${event.id}`)} className="text-blue-500 text-sm">Edit</button>
                </div>
              ))}
            </div>

            {/* Settings Section */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-medium">Global Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={settings.youtubeChannelUrl || ''}
                    onChange={e => setSettings({ ...settings, youtubeChannelUrl: e.target.value })}
                    className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://youtube.com/@..."
                  />
                  <p className="text-xs text-text/50 mt-2">This link is used for the "All Sermons" button.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">YouTube Channel ID</label>
                  <input
                    type="text"
                    value={settings.youtubeChannelId || ''}
                    onChange={e => setSettings({ ...settings, youtubeChannelId: e.target.value })}
                    className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="UC..."
                  />
                  {settings.lastYoutubeSyncAt && (
                    <p className="text-xs text-text/50 mt-2">Last sync: {new Date(settings.lastYoutubeSyncAt).toLocaleString()}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                <button 
                  onClick={saveSettings} 
                  disabled={savingSettings}
                  className="px-6 py-3 bg-accent text-white rounded-full uppercase tracking-widest text-sm font-bold hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
                <button
                  onClick={syncYoutube}
                  disabled={syncingYoutube}
                  className="px-6 py-3 bg-text text-white rounded-full uppercase tracking-widest text-sm font-bold hover:bg-text/90 transition-colors disabled:opacity-50"
                >
                  {syncingYoutube ? 'Syncing...' : 'Sync YouTube Now'}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
