'use client';

/**
 * AUTO PULSE — Search Page
 * Hugging AI ile metin analizi
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useState } from 'react';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;

    setIsAnalyzing(true);

    try {
      // Hugging Face API çağrısı (mock - gerçek API key gerekli)
      // const response = await fetch('https://api-inference.huggingface.co/models/...', {
      //   method: 'POST',
      //   headers: { Authorization: 'Bearer YOUR_API_KEY' },
      //   body: JSON.stringify({ inputs: searchQuery })
      // });

      // Mock response
      setTimeout(() => {
        const mockResult = language === 'tr'
          ? `Arama Sorgusu: "${searchQuery}"\n\nAnaliz Sonucu:\nBu sorgu otomotiv sektörü ile ilgili. Yapay zeka modeli ilgili araç verilerini tarıyor.\n\nSonuçlar yakında burada görüntülenecek.`
          : `Search Query: "${searchQuery}"\n\nAnalysis Result:\nThis query is related to the automotive sector. AI model scanning relevant vehicle data.\n\nResults will be displayed here soon.`;

        setAnalysisResult(mockResult);
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      setIsAnalyzing(false);
      setAnalysisResult(language === 'tr' ? 'Analiz başarısız.' : 'Analysis failed.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalyze();
    }
  };

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
              {language === 'tr' ? 'Yapay Zeka Arama' : 'AI Search'}
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              {language === 'tr'
                ? 'Otomotiv verilerinde yapay zeka destekli arama ve analiz'
                : 'AI-powered search and analysis in automotive data'}
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-8 relative group">
            <div className="absolute -inset-1 bg-primary-container/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden">
              <span className="material-symbols-outlined ml-6 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full bg-transparent border-none text-on-surface font-body px-6 py-6 focus:ring-0 placeholder:text-on-surface-variant/40 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
                placeholder={language === 'tr' ? 'Marka, model veya yıl analiz et...' : 'Analyze brand, model or year...'}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isAnalyzing}
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !searchQuery.trim()}
                className="mr-4 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing
                  ? (language === 'tr' ? 'Analiz Ediliyor...' : 'Analyzing...')
                  : (language === 'tr' ? 'Analiz Et' : 'Analyze')
                }
              </button>
            </div>
          </div>

          {/* Analysis Result */}
          {analysisResult && (
            <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary-container text-3xl">
                  psychology
                </span>
                <h2 className="font-headline text-xl font-bold text-on-surface uppercase">
                  {language === 'tr' ? 'Analiz Sonucu' : 'Analysis Result'}
                </h2>
              </div>
              <div className="font-body text-on-surface-variant whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: language === 'tr' ? 'Popüler Aramalar' : 'Popular Searches',
                description: language === 'tr' ? 'Tesla Model 3, BMW 3 Serisi' : 'Tesla Model 3, BMW 3 Series',
                icon: 'trending_up',
              },
              {
                title: language === 'tr' ? 'Son Analizler' : 'Recent Analyses',
                description: language === 'tr' ? '5 analiz geçmişte' : '5 analyses in history',
                icon: 'history',
              },
              {
                title: language === 'tr' ? 'Araç Karşılaştır' : 'Compare Vehicles',
                description: language === 'tr' ? 'Yan yana analiz' : 'Side-by-side analysis',
                icon: 'compare_arrows',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all cursor-pointer"
                onClick={() => router.push(card.icon === 'compare_arrows' ? '/compare' : '/discover')}
              >
                <span className="material-symbols-outlined text-primary-container text-4xl mb-4">
                  {card.icon}
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-on-surface-variant text-sm">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
