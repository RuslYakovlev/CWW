import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', subtitle: '', dateLabel: '', timeLabel: '', formatLabel: '', imageUrl: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetch(`/api/events`).then(res => res.json()).then(data => {
        if (Array.isArray(data)) {
          const event = data.find((e: any) => e.id === id);
          if (event) setFormData(event);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = id === 'new' ? 'POST' : 'PUT';
    const url = id === 'new' ? '/api/events' : `/api/events/${id}`;

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg p-8 flex justify-center items-center">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-serif font-medium text-text mb-8">{id === 'new' ? 'Add Event' : 'Edit Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Date Label</label>
              <input
                type="text"
                value={formData.dateLabel}
                onChange={e => setFormData({ ...formData, dateLabel: e.target.value })}
                className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Time Label</label>
              <input
                type="text"
                value={formData.timeLabel}
                onChange={e => setFormData({ ...formData, timeLabel: e.target.value })}
                className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Format Label</label>
              <input
                type="text"
                value={formData.formatLabel}
                onChange={e => setFormData({ ...formData, formatLabel: e.target.value })}
                className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-5 py-4 bg-secondary/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Preview" className="mt-4 h-32 rounded-xl object-cover" />
              )}
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="px-8 py-4 bg-secondary text-text rounded-full uppercase tracking-widest text-sm font-bold hover:bg-secondary/80 transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-4 bg-accent text-white rounded-full uppercase tracking-widest text-sm font-bold hover:bg-accent/90 transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
