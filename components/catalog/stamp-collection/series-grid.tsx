import React from 'react';

const SeriesGrid = ({ series, onSeriesSelect }: any) => {
  return (
    <div className="fade-in">
      {/* <div className="text-center mb-12">
        <p className="text-xl theme-text-secondary max-w-3xl mx-auto">
          Discover our carefully curated selection of premium philatelic treasures
        </p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {series.map((s: any, index: number) => (
          <div
            key={s.id}
            className="theme-card border-2 rounded-2xl shadow-lg overflow-hidden hover-lift cursor-pointer group hover:border-current hover:shadow-2xl transition-all duration-300"
            onClick={() => onSeriesSelect(s.id, s.description, s.image)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Category Image */}
            <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e: any) => {
                  e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stamp-red-500 bg-opacity-90 text-white">
                  {s.totalTypes || 0} Types
                </span>
              </div>
            </div>

            {/* Category Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold theme-text-primary mb-2 group-hover:opacity-80 transition-colors duration-300">
                {s.name}
              </h3>
              <p className="theme-text-secondary text-xs leading-relaxed mb-3">
                {s.description}
              </p>
              
              {/* Action Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center theme-text-primary group-hover:opacity-80 transition-colors duration-300">
                  <span className="text-xs font-medium">View Collection</span>
                  <svg 
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                {/* Stamp Count */}
                <div className="text-xs theme-text-muted">
                  {s.stampsCount} stamps
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesGrid;
