'use client';

import { useEffect, useState } from 'react';

import { SideNavBar, TopNavBar } from '@/components/dashboard';

type IssuePayload = {
  id: string;
  title: string;
  description: string;
  reference: string;
  analysis: {
    priority: 'low' | 'medium' | 'high';
    sentiment: {
      label: string;
      score: number;
    };
    category: {
      label: string;
      score: number;
    };
    summary: string;
    keywords: string[];
  };
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssuePayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadIssues() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/ai/issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ limit: 6 }),
          signal: controller.signal,
        });

        if (!response.ok) return;
        const data = await response.json();
        setIssues(data.issues ?? []);
      } catch {
        setIssues([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadIssues();
    return () => controller.abort();
  }, []);

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
              Sorun Takibi
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              AI destekli kategori, duygu ve öncelik analizi.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`issue-skeleton-${index}`} className="bg-surface-container-low rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-surface-container-highest rounded w-3/4 mb-4" />
                  <div className="h-4 bg-surface-container-highest rounded w-full mb-2" />
                  <div className="h-4 bg-surface-container-highest rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {issue.analysis.category.label}
                        </span>
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-primary-container/10 text-primary-container">
                          {issue.analysis.priority}
                        </span>
                      </div>
                      <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
                        {issue.title}
                      </h3>
                      <p className="font-body text-on-surface-variant text-sm mb-3">
                        {issue.description}
                      </p>
                      <p className="font-body text-on-surface text-sm">
                        {issue.analysis.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/10">
                    {issue.analysis.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-surface-container-highest rounded text-[10px] text-on-surface-variant"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
