import React from 'react';

const TypesView = ({ series, onTypesSelect, onBack }: any) => {
  return (
    <div className="fade-in">
      {/* Back Button and Header */}
      <div className="flex md:items-center mb-4 md:justify-between flex-col md:flex-row gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center theme-text-primary hover:opacity-80 transition-colors duration-300 mr-6 theme-card border-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-xs md:text-sm font-semibold"
          >
            <svg className="w-3 h-3 mr-1 md:w-5 md:h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Series
          </button>
        </div>

        {/* Modern Breadcrumb Navigation */}
        <div className="flex items-center">
          {/* Mobile breadcrumb */}
          <div className="md:hidden flex items-center">
            <nav className="flex items-center text-xs">
              <button
                onClick={onBack}
                className="inline-flex items-center px-2 py-1 rounded-md text-stamp-royal-600 hover:text-stamp-primary hover:bg-stamp-royal-50 transition-all duration-200 font-medium"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Series
              </button>
              <span className="mx-1 text-stamp-royal-300">/</span>
              <span className="font-semibold text-stamp-primary truncate max-w-[120px]">
                {series.name}
              </span>
            </nav>
          </div>

          {/* Desktop breadcrumb */}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center space-x-1 text-sm">
              <div className="flex items-center">
                <button
                  onClick={onBack}
                  className="group inline-flex items-center px-3 py-2 rounded-lg text-stamp-royal-600 hover:text-stamp-primary hover:bg-stamp-royal-50 transition-all duration-200 font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5l4-4 4 4" />
                  </svg>
                  Series
                </button>

                <div className="flex items-center mx-2">
                  <svg
                    className="w-4 h-4 text-stamp-royal-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-stamp-gold-100 to-stamp-gold-50 border border-stamp-gold-200 shadow-sm">
                  <svg
                    className="w-4 h-4 mr-1.5 text-stamp-gold-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-semibold text-stamp-primary text-sm truncate max-w-[200px]">
                    {series.name}
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="theme-card border-2 rounded-2xl shadow-lg p-4 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden mb-6 md:mb-0 md:mr-8 flex-shrink-0">
            <img
              src={series.image}
              alt={series.name}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center';
              }}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-xl font-bold theme-text-primary mb-2">
              {series.name}
            </h1>
            <p className="theme-text-secondary text-sm md:text-lg mb-4">
              {series.description}
            </p>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-stamp-gold-500 bg-opacity-20 text-stamp-primary text-center">
                {series.types?.length || 0} Types Available
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-stamp-red-500 bg-opacity-20 text-stamp-red-600 text-center">
                {series.types?.reduce((total: number, types: any) => total + (types.stamps?.length || 0), 0) || 0} Total Stamps
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold theme-text-primary">
          📋 Available Types
        </h2>

        {series.types && series.types.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {series.types.map((type: any, index: number) => {
              const yearRangeDisplay = type.periodStart === type.periodEnd
                ? (type.periodStart ?? type.periodEnd ?? '-')
                : `${type.periodStart ?? '-'} - ${type.periodEnd ?? '-'}`;

              const validMintPrices = (type.stamps ?? [])
                .map((stamp: any) => {
                  const rawPrice = stamp?.prices?.mint;
                  const numericPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice);
                  return Number.isFinite(numericPrice) ? numericPrice : null;
                })
                .filter((price: number | null): price is number => price !== null && price > 0);

              let priceRangeDisplay: string | null = null;
              if (validMintPrices.length > 0) {
                const minPrice = Math.min(...validMintPrices);
                const maxPrice = Math.max(...validMintPrices);
                priceRangeDisplay = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
              }

              return (
                <div
                  key={type.id}
                  className="theme-card border-2 rounded-xl shadow-lg overflow-hidden hover-lift cursor-pointer group hover:border-current transition-all duration-300"
                  onClick={() => onTypesSelect(type)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Series Header */}
                  <div className="bg-gradient-to-r from-stamp-royal-600 to-stamp-primary px-6 py-10">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                        {type.name}
                      </h3>
                      <span className="text-sm bg-white bg-opacity-20 text-white px-2 py-1 rounded flex-shrink-0">
                        {yearRangeDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Stamp Preview */}
                  <div className="p-6">
                    {/* First few stamps preview */}
                    <div className="flex space-x-2 mb-4 overflow-hidden">
                      {type.stamps?.slice(0, 4).map((stamp: any) => (
                        <div
                          key={stamp.id}
                          className="w-12 h-16 rounded border-2 border-gray-200 overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={stamp.image}
                            alt={stamp.denomination}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = `https://via.placeholder.com/60x80/8B4513/FFFFFF?text=${stamp.denomination}`;
                            }}
                          />
                        </div>
                      ))}
                      {type.stamps && type.stamps.length > 4 && (
                        <div className="w-12 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                          +{type.stamps.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Types Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Stamps:</span>
                        <span className="font-medium text-gray-900">{type.stamps?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Year Issued:</span>
                        <span className="font-medium text-gray-900">{type.year}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price Range:</span>
                        <span className={`font-medium ${priceRangeDisplay ? 'text-gray-900' : 'text-gray-400'}`}>
                          {priceRangeDisplay ?? 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex items-center justify-center pt-4 border-t border-gray-100">
                      <div className="flex items-center text-stamp-primary group-hover:text-stamp-secondary transition-colors duration-300">
                        <span className="text-sm font-medium">View Stamps</span>
                        <svg
                          className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Types Available</h3>
            <p className="text-gray-500">This category doesn't have any types yet.</p>
          </div>
        )}
      </div>
    </div>
  )
};

export default TypesView;
