import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import API from '../services/api';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const { data } = await API.get('/notifications'); setItems(data.items || []); }
    catch (err) { setError(err.response?.data?.message || 'Unable to load notifications.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const markRead = async (id) => { try { await API.patch(`/notifications/${id}/read`); setItems((rows) => rows.map((row) => row._id === id ? { ...row, readAt: new Date().toISOString() } : row)); } catch (err) { setError(err.response?.data?.message || 'Unable to update notification.'); } };
  const markAll = async () => { try { await API.patch('/notifications/read-all'); setItems((rows) => rows.map((row) => ({ ...row, readAt: row.readAt || new Date().toISOString() }))); } catch (err) { setError(err.response?.data?.message || 'Unable to update notifications.'); } };
  return <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6"><div className="mx-auto max-w-4xl"><div className="mb-7 flex items-center justify-between gap-4"><div><h1 className="text-3xl font-black text-slate-900">Notifications</h1><p className="mt-1 text-slate-600">Request matches and donation updates for your account.</p></div><button onClick={markAll} disabled={!items.some((item) => !item.readAt)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"><CheckCheck className="h-4 w-4"/>Mark all read</button></div>
  {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-4 text-rose-700">{error}</p>}{loading ? <p className="py-16 text-center text-slate-500">Loading notifications…</p> : items.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center"><Bell className="mx-auto h-9 w-9 text-slate-300"/><p className="mt-3 font-semibold text-slate-700">You’re all caught up</p></div> : <div className="space-y-3">{items.map((item) => <article key={item._id} className={`flex items-start justify-between gap-4 rounded-2xl border bg-white p-5 ${item.readAt ? 'border-slate-200' : 'border-rose-200'}`}><div><p className="font-semibold text-slate-900">{item.message}</p><p className="mt-2 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p></div>{!item.readAt && <button onClick={() => markRead(item._id)} className="shrink-0 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">Mark read</button>}</article>)}</div>}</div></main>;
}
