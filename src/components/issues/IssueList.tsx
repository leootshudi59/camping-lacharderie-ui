'use client';

import { useState } from 'react';
import { mockIssues } from '@/mocks/mockIssues';
import { Issue } from '@/types/issue';
import IssueDetails from './IssueDetails';

const statusColors: Record<string, string> = {
  open: 'bg-red-100 text-red-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
};

export default function IssueList() {
  const [issues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Tickets / Problèmes</h1>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Titre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Locatif</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr key={issue.issue_id} className="hover:bg-green-50 transition">
                <td className="px-4 py-3 font-semibold text-gray-800">{issue.title}</td>
                <td className="px-4 py-3 text-gray-600">{issue.rental_name}</td>
                <td className="px-4 py-3 text-gray-600">{issue.res_name}</td>
                <td className="px-4 py-3 text-gray-500">{issue.created_at.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status]}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="px-3 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-4">
        {issues.map((issue) => (
          <div key={issue.issue_id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{issue.title}</h3>
                <p className="text-sm text-gray-500">{issue.rental_name} – {issue.res_name}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[issue.status]}`}>
                {issue.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {issue.created_at.slice(0, 10)}
            </p>
            <div className="text-right">
              <button
                onClick={() => setSelectedIssue(issue)}
                className="px-3 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs"
              >
                Voir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl w-full max-w-xl p-0 shadow-lg relative animate-in fade-in zoom-in-90">
            <IssueDetails issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
          </div>
        </div>
      )}
    </div>
  );
}