import React from 'react';

const StampGrid = ({ stamps, onStampSelect, selectedStamp }: any) => {
  if (!stamps || stamps.length === 0) {
    return (
      <div className="theme-card border-2 rounded-2xl shadow-lg p-16">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-stamp-royal-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium theme-text-primary mb-2">No Stamps Available</h3>
          <p className="theme-text-muted">This series doesn't have any stamps yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-card border-2 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold theme-text-primary">
          🎯 Stamps Collection
        </h2>
        <div className="text-sm theme-text-muted">
          {stamps.length} stamp{stamps.length !== 1 ? 's' : ''} • Sorted by year
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {stamps.map((stamp: any, index: number) => (
          <div
            key={stamp.id}
            className={`group cursor-pointer transition-all duration-300 ${
              selectedStamp?.id === stamp.id ? 'scale-105' : ''
            }`}
            onClick={() => onStampSelect(stamp)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Stamp Card */}
            <div className="relative theme-card rounded-xl p-4 hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:scale-105">
              {/* Stamp Image */}
              <div className="aspect-[4/5] mb-3 bg-gray-100 rounded-lg shadow-sm overflow-hidden">
                <img
                  src={stamp.image}
                  alt={`${stamp.denomination} stamp`}
                  className="w-full h-full object-cover stamp-image"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop&crop=center';
                  }}
                />
              </div>

              {/* Stamp Info */}
              <div className="text-center space-y-1">
                <div className="font-bold theme-text-primary text-lg">
                  {stamp.denomination}
                </div>
                <div className="text-xs theme-text-secondary uppercase tracking-wide">
                  {stamp.catalogNumber}
                </div>
                <div className="text-xs theme-text-muted">
                  {stamp.color}
                </div>
                <div className="text-xs font-medium theme-text-secondary">
                  {stamp.year}
                </div>
              </div>

              {/* Price Badge */}
              <div className="mt-3 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Mint: ${stamp.prices.mint}
                </span>
              </div>

              {/* Hover Overlay - Positioned correctly within the card */}
              <div className="absolute inset-0 bg-stamp-gold-500 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <svg className="w-4 h-4 text-stamp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Price Info on Hover */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white rounded-lg shadow-md p-2 text-xs border border-stamp-royal-300">
                <div className="flex justify-between items-center">
                  <span className="text-stamp-royal-600">Used: ${stamp.prices.used}</span>
                  <span className="text-stamp-royal-600">Fine: ${stamp.prices.fineUsed}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Footer */}
      <div className="mt-8 pt-6 border-t border-stamp-royal-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-stamp-royal-600 mb-4 sm:mb-0">
            Click on any stamp to view detailed information
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
              <span className="text-stamp-royal-600">Mint condition</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
              <span className="text-stamp-royal-600">Fine used</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-100 rounded mr-2"></div>
              <span className="text-stamp-royal-600">Used</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampGrid;