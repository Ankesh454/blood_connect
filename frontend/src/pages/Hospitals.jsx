import { useEffect, useState } from 'react';
import { Building2, MapPin, Phone, Search } from 'lucide-react';
import API from '../services/api';

export default function Hospitals() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    API.get('/hospitals', { params: { q: query, city } }).then(({ data }) => { if (active) setItems(data.items || []); })
      .catch((err) => { if (active) setError(err.response?.data?.message || 'Unable to load hospitals.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, city]);
  return <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
    <header className="mb-8"><h1 className="text-3xl font-black text-slate-900">Hospitals</h1><p className="mt-2 text-slate-600">Browse public facility listings. Blood group matches do not establish medical compatibility or eligibility.</p></header>
    <div className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="h-4 w-4 text-slate-400"/><span className="sr-only">Search hospitals</span><input className="w-full py-3 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hospital name or address"/></label>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3"><MapPin className="h-4 w-4 text-slate-400"/><span className="sr-only">Filter by city</span><input className="w-full py-3 outline-none" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City"/></label>
    </div>
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-rose-700">{error}</p>}
    {loading ? <p className="py-16 text-center text-slate-500">Loading hospitals…</p> : items.length === 0 ? <p className="rounded-2xl bg-white p-12 text-center text-slate-500">No hospital listings found.</p> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((hospital) => <article key={hospital._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Building2 className="mb-4 h-6 w-6 text-rose-600"/><h2 className="text-lg font-bold text-slate-900">{hospital.name}</h2>{hospital.verified && <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">Verified listing</span>}<p className="mt-3 text-sm text-slate-600">{hospital.address}</p><p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4"/>{hospital.city}</p>{hospital.phone && <a className="mt-2 flex items-center gap-2 text-sm font-semibold text-rose-700" href={`tel:${hospital.phone}`}><Phone className="h-4 w-4"/>{hospital.phone}</a>}</article>)}</div>}
  </div></main>;
}
