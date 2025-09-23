import React, { use, useEffect, useState } from 'react';
import SeriesGrid from './series-grid';
import TypesView from './types-view';
import StampView from './stamp-view';
import './index.css';
import { useCatalogData } from '@/lib/context/catalog-data-context';

function App() {
  const [currentView, setCurrentView] = useState('series');
  const [selectedTypes, setSelectedTypes] = useState<any>(null);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [seriesData, setSeriesData] = useState<any>([]);
  const { normalizedStamps } = useCatalogData()

  useEffect(() => {
    const series: Record<string, any> = {}
    normalizedStamps.forEach(s => {
      if (s.isInstance) return
      const key = s.seriesName || 'Unknown Series'
      if (!series[key]) {
        series[key] = {
          id: key,
          name: key,
          description: s.description,
          image: s.stampImageUrl,
          totalTypes: 0,
          typeNames: {},
          stampsCount: 0
        }
      }

      const entry = series[key]
      entry.stampsCount = entry.stampsCount + 1
      // Track distinct stamp groups per series
      if (s.typeName) entry.typeNames[s.typeName] = true
    })

    const builtSeries = Object.values(series).map(seriesItem => ({
      id: seriesItem.id,
      name: seriesItem.name,
      image: seriesItem.image,
      description: seriesItem.description,
      totalTypes: Object.keys(seriesItem.typeNames).length,
      typeNames: seriesItem.typeNames,
      stampsCount: seriesItem.stampsCount
    }))
    setSeriesData(builtSeries)
  }, [])

  const handleSeriesSelect = (seriesName: any, description: string, image: string) => {
    const typeNamesToTypesMap = normalizedStamps
      .filter(s => s.seriesName === seriesName)
      .reduce((acc: any, s) => {
        if (s.isInstance) return acc
        if (!acc[s.typeName]) {
          acc[s.typeName] = {
            id: s.typeName,
            seriesName: s.seriesName,
            year: s.issueYear,
            name: s.typeName,
            description: s.stampGroupName,
            image: s.stampImageUrl,
            periodStart: s.issueYear,
            periodEnd: s.issueYear,
            stamps: [{
              id: s.stampId,
              catalogNumber: s.categoryCode,
              denomination: `${s.denominationValue}${s.denominationSymbol}`,
              color: s.color,
              year: s.issueYear,
              image: s.stampImageUrl,
              prices: { mint: s.mintValue, fineUsed: s.finestUsedValue, used: s.usedValue },
              notes: s.name
            }]
          }
        } else {
          acc[s.typeName].periodStart = Math.min(acc[s.typeName].periodStart, s.issueYear as unknown as number)
          acc[s.typeName].periodEnd = Math.max(acc[s.typeName].periodEnd, s.issueYear as unknown as number)
          acc[s.typeName].stamps.push({
            id: s.stampId,
            catalogNumber: s.categoryCode,
            denomination: `${s.denominationValue}${s.denominationSymbol}`,
            color: s.color,
            year: s.issueYear,
            image: s.stampImageUrl,
            prices: { mint: s.mintValue, fineUsed: s.finestUsedValue, used: s.usedValue },
            notes: s.name
          })
        }
        return acc
      }, {});
    const stamps = Object.values(typeNamesToTypesMap)
    setSelectedSeries({
      name: seriesName,
      description,
      image,
      types: stamps,
    });
    setCurrentView('types');
  };

  const handleTypesSelect = (type: any) => {
    setSelectedTypes(type);
    setCurrentView('stamps');
  };

  const handleBackToSeries = () => {
    setSelectedSeries(null);
    setSelectedTypes(null);
    setCurrentView('series');
  };

  const handleBackToTypes = () => {
    setSelectedTypes(null);
    setCurrentView('types');
  };

  return (
    <div>
      {/* Mobile Breadcrumb Navigation */}
      {(selectedTypes || selectedSeries) && (
        <div className="md:hidden border-b border-stamp-gold-500 px-4 py-3 mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={handleBackToSeries}
              className="flex items-center text-stamp-primary hover:text-stamp-gold-600 font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Series
            </button>
            {selectedTypes && (
              <>
                <span className="text-stamp-gold-400">/</span>
                {currentView === 'stamps' ? (
                  <button
                    onClick={handleBackToTypes}
                    className="flex items-center text-stamp-primary hover:text-stamp-gold-600 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {selectedSeries.name}
                  </button>
                ) : (
                  <span className="text-stamp-royal-700 font-medium">{selectedSeries.name}</span>
                )}
              </>
            )}
            {selectedTypes && (
              <>
                <span className="text-stamp-gold-400">/</span>
                <span className="text-stamp-royal-700 font-medium">{selectedTypes.name}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto">
        {currentView === 'series' && (
          <SeriesGrid
            series={seriesData}
            onSeriesSelect={handleSeriesSelect}
          />
        )}

        {currentView === 'types' && selectedSeries && (
          <TypesView
            series={selectedSeries}
            onTypesSelect={handleTypesSelect}
            onBack={handleBackToSeries}
          />
        )}

        {currentView === 'stamps' && selectedSeries && (
          <StampView
            types={selectedTypes}
            series={selectedSeries}
            onBack={handleBackToTypes}
            onBackHome={handleBackToSeries}
          />
        )}
      </main>
    </div>
  );
}

export default App;
