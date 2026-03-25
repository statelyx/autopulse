'use client';

/**
 * AUTO PULSE — Issues Page
 * AI destekli sorun takibi ve analizi
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useEffect, useState } from 'react';
import { aiService } from '@/lib/ai';
import type { IssueAnalysis } from '@/lib/ai/types';

// Örnek issue verileri
const sampleIssues = [
  {
    id: 1,
    title: 'Porsche 911 navigation system crashes frequently',
    description: 'The navigation system in my 2024 Porsche 911 crashes intermittently, especially when using voice commands. Very frustrating experience.',
    category: 'ui/ux',
    status: 'open',
    createdAt: '2026-03-20',
  },
  {
    id: 2,
    title: 'Tesla Model S range estimation inaccurate',
    description: 'The estimated range shown on the dashboard is significantly lower than actual range. After software update, the difference increased.',
    category: 'data',
    status: 'investigating',
    createdAt: '2026-03-19',
  },
  {
    id: 3,
    title: 'BMW M3 transmission delay in sport mode',
    description: 'When shifting to sport mode, there is a noticeable 2-3 second delay before the transmission responds. This affects performance driving.',
    category: 'performance',
    status: 'open',
    createdAt: '2026-03-18',
  },
  {
    id: 4,
    title: 'Feature request: Dark mode for dashboard',
    description: 'Would love to see a dark mode option for the vehicle dashboard interface. Current brightness is too high for night driving.',
    category: 'feature',
    status: 'planned',
    createdAt: '2026-03-17',
  },
  {
    id: 5,
    title: 'Security concern: Remote access vulnerability',
    description: 'Discovered potential security vulnerability in remote access system. Unauthorized access possible under certain conditions.',
    category: 'security',
    status: 'critical',
    createdAt: '2026-03-16',
  },
];

export default function IssuesPage() {
  const { language } = useLanguageTheme();
  const [issues, setIssues] = useState(sampleIssues);
  const [analyses, setAnalyses] = useState<Map<number, IssueAnalysis>>(new Map());
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadAIAnalyses();
  }, []);

  const loadAIAnalyses = async () => {
    setIsLoading(true);
    try {
      const analysisMap = new Map<number, IssueAnalysis>();

      // Her issue için AI analizi çalıştır
      for (const issue of issues) {
        const analysis = await aiService.analyzeIssue({
          title: issue.title,
          description: issue.description,
          category: issue.category,
        });
        analysisMap.set(issue.id, analysis);
      }

      setAnalyses(analysisMap);
    } catch (error) {
      console.error('AI analizi yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error bg-error-container/10';
      case 'medium': return 'text-primary-container bg-primary-container/10';
      case 'low': return 'text-secondary-container bg-secondary-container/10';
      default: return 'text-on-surface-variant bg-surface-container-highest';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'sentiment_very_satisfied';
      case 'negative': return 'sentiment_very_dissatisfied';
      default: return 'sentiment_neutral';
    }
  };

  const filteredIssues = filterCategory === 'all'
    ? issues
    : issues.filter(issue => issue.category === filterCategory);

  const categories = ['all', 'ui/ux', 'data', 'performance', 'feature', 'security'];

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
                  {language === 'tr' ? 'Sorun Takibi' : 'Issue Tracker'}
                </h1>
                <p className="font-body text-on-surface-variant text-lg">
                  {language === 'tr'
                    ? 'AI destekli sorun analizi ve kategorizasyon'
                    : 'AI-powered issue analysis and categorization'}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-container/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">
                  {language === 'tr' ? 'AI Aktif' : 'AI Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-label text-[10px] uppercase tracking-widest transition-all ${
                  filterCategory === category
                    ? 'bg-primary-container text-on-primary-fixed'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {category === 'all'
                  ? (language === 'tr' ? 'Tümü' : 'All')
                  : category
                }
              </button>
            ))}
          </div>

          {/* Issues Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface-container-low rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-surface-container-highest rounded w-3/4 mb-4" />
                  <div className="h-4 bg-surface-container-highest rounded w-full mb-2" />
                  <div className="h-4 bg-surface-container-highest rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredIssues.map((issue) => {
                const analysis = analyses.get(issue.id);
                return (
                  <div
                    key={issue.id}
                    className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all"
                  >
                    {/* Issue Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {issue.category}
                          </span>
                          {analysis && (
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(analysis.priority)}`}>
                              {analysis.priority}
                            </span>
                          )}
                        </div>
                        <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
                          {issue.title}
                        </h3>
                        <p className="font-body text-on-surface-variant text-sm">
                          {issue.description}
                        </p>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    {analysis && (
                      <div className="mt-4 pt-4 border-t border-outline-variant/10">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">
                              {getSentimentIcon(analysis.sentiment.label)}
                            </span>
                            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                              {analysis.sentiment.label} ({Math.round(analysis.sentiment.score * 100)}%)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-secondary-container">
                              category
                            </span>
                            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                              {analysis.category.label} ({Math.round(analysis.category.score * 100)}%)
                            </span>
                          </div>
                        </div>

                        {analysis.summary && (
                          <div className="mb-3">
                            <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                              {language === 'tr' ? 'AI Özeti' : 'AI Summary'}
                            </div>
                            <p className="font-body text-on-surface text-sm">
                              {analysis.summary}
                            </p>
                          </div>
                        )}

                        {analysis.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-surface-container-highest rounded text-[10px] text-on-surface-variant"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Insights Summary */}
          {!isLoading && analyses.size > 0 && (
            <div className="mt-12 bg-surface-container-low rounded-xl p-8 border border-primary-container/20">
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-6">
                {language === 'tr' ? 'AI Öngörüleri' : 'AI Insights'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-surface-container-highest rounded-lg">
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    {language === 'tr' ? 'Kritik Sorunlar' : 'Critical Issues'}
                  </div>
                  <p className="font-headline text-3xl font-bold text-error">
                    {Array.from(analyses.values()).filter(a => a.priority === 'high').length}
                  </p>
                </div>

                <div className="p-4 bg-surface-container-highest rounded-lg">
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    {language === 'tr' ? 'Negatif Geri Bildirim' : 'Negative Feedback'}
                  </div>
                  <p className="font-headline text-3xl font-bold text-primary-container">
                    {Array.from(analyses.values()).filter(a => a.sentiment.label === 'negative').length}
                  </p>
                </div>

                <div className="p-4 bg-surface-container-highest rounded-lg">
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    {language === 'tr' ? 'Özellik İstekleri' : 'Feature Requests'}
                  </div>
                  <p className="font-headline text-3xl font-bold text-secondary-container">
                    {Array.from(analyses.values()).filter(a => a.category.label === 'feature').length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
