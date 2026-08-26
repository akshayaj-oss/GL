import { useEffect, useState } from 'react';
import { personalities, type Category } from '../data';
import { Users, BarChart3, Clock } from 'lucide-react';

interface ResultRecord {
  id: string;
  employee_code: string;
  personality: Category;
  created_at: string;
}

export function Dashboard() {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load results", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  const getClubCount = (cat: Category) => results.filter(r => r.personality === cat).length;

  return (
    <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 w-full animate-in fade-in zoom-in duration-500">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h2>
        <p className="text-brand-lavender text-sm">Platform Content and Data Management</p>
      </div>

      <div className="bg-brand-lavender text-brand-navy rounded-2xl p-6 mb-10 flex flex-col items-center shadow-lg">
        <h3 className="text-xl font-bold mb-2 flex items-center"><Users className="w-6 h-6 mr-2" /> Total Participation</h3>
        <p className="text-6xl font-heading font-bold">{results.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {(Object.keys(personalities) as Category[]).map(cat => (
          <div key={cat} className="bg-white/10 rounded-2xl p-5 border border-white/20 flex flex-col items-center text-center">
            <span className="text-3xl mb-3">{personalities[cat].icon}</span>
            <h4 className="font-heading font-semibold text-lg mb-2">{personalities[cat].title}</h4>
            <p className="text-4xl font-bold mt-auto text-yellow-400">{getClubCount(cat)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-5 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold flex items-center"><BarChart3 className="w-5 h-5 mr-2" /> Participant Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-brand-lavender text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Employee Code</th>
                <th className="px-6 py-4 font-semibold">Club Assigned</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-white/50">
                    No participants yet.
                  </td>
                </tr>
              ) : (
                results.slice().reverse().map((record) => (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{record.employee_code}</td>
                    <td className="px-6 py-4 flex items-center">
                      <span className="mr-2">{personalities[record.personality].icon}</span>
                      <span className="font-semibold">{personalities[record.personality].title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-lavender/70 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      &nbsp;&middot;&nbsp; 
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
