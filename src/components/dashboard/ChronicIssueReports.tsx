'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type IssueCard = {
  id: string;
  title: string;
  description: string;
  reference: string;
  vehicleId: string;
  analysis: {
    priority: 'low' | 'medium' | 'high';
    summary: string;
  };
};

const priorityMap = {
  high: {
    icon: 'warning',
    iconColor: 'text-error',
    badge: 'Kritik',
    badgeColor: 'bg-error-container/20 text-error',
    borderColor: 'border-error',
  },
  medium: {
    icon: 'info',
    iconColor: 'text-primary',
    badge: 'İzleniyor',
    badgeColor: 'bg-primary-container/10 text-primary-container',
    borderColor: 'border-primary-container',
  },
  low: {
    icon: 'check_circle',
    iconColor: 'text-secondary-container',
    badge: 'Stabil',
    badgeColor: 'bg-secondary-container/10 text-secondary-container',
    borderColor: 'border-secondary-container',
  },
};

export function ChronicIssueReports() {
  const [issues, setIssues] = useState<IssueCard[]>([]);
  const items: Array<IssueCard | { id: string }> = issues.length > 0
    ? issues
    : Array.from({ length: 3 }, (_, index) => ({ id: `issue-${index}` }));

  useEffect(() => {
    const controller = new AbortController();

    async function loadIssues() {
      try {
        const response = await fetch('/api/ai/issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ limit: 3 }),
          signal: controller.signal,
        });

        if (!response.ok) return;
        const data = await response.json();
        setIssues(data.issues ?? []);
      } catch {
        setIssues([]);
      }
    }

    loadIssues();
    return () => controller.abort();
  }, []);

  return (
    <div className="mt-24">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="font-headline text-2xl font-bold uppercase tracking-tighter">
          Kronik risk raporları
        </h2>
        <div className="h-[1px] flex-grow bg-outline-variant/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {items.map((issue) => {
          if (!('analysis' in issue)) {
            return (
              <div key={issue.id} className="p-8 bg-surface-container rounded-2xl shadow-lg animate-pulse">
                <div className="h-5 bg-surface-container-highest rounded mb-6" />
                <div className="h-4 bg-surface-container-highest rounded mb-3" />
                <div className="h-4 bg-surface-container-highest rounded mb-3" />
                <div className="h-4 bg-surface-container-highest rounded" />
              </div>
            );
          }

          const priority = issue.analysis.priority;
          const meta = priorityMap[priority];

          return (
            <div
              key={issue.id}
              className={`p-8 bg-surface-container rounded-2xl border-l-4 ${meta.borderColor} shadow-lg`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`material-symbols-outlined ${meta.iconColor}`}>
                  {meta.icon}
                </span>
                <span className={`px-2 py-1 ${meta.badgeColor} text-[10px] font-bold uppercase tracking-widest rounded`}>
                  {meta.badge}
                </span>
              </div>

              <h4 className="font-headline text-sm font-bold uppercase mb-2">
                {issue.title}
              </h4>
              <p className="text-on-surface-variant text-xs mb-4 font-body leading-relaxed">
                {issue.description}
              </p>
              <p className="text-on-surface text-xs mb-6 font-body leading-relaxed">
                {issue.analysis.summary}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                  {issue.reference}
                </span>
                <Link
                  href={`/vehicle/${issue.vehicleId}`}
                  className="text-on-surface text-xs font-bold hover:text-primary underline transition-colors"
                >
                  Araç detayı
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
