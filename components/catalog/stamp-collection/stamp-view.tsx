import React, { useState } from 'react';
import StampGrid from './stamp-grid';
import StampTable from './stamp-table';
import { Layers, Package, Maximize2 } from 'lucide-react';
import { useCatalogData } from '@/lib/context/catalog-data-context';

const StampView = ({ series, types, onBack, onBackHome }: any) => {
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedStamp, setSelectedStamp] = useState<any>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const { normalizedStamps } = useCatalogData();

  const sortedStamps = types.stamps ? [...types.stamps].sort((a, b) => a.year - b.year) : [];

  const validMintPrices = sortedStamps
    .map((stamp: any) => {
      const rawPrice = stamp?.prices?.mint;
      if (rawPrice === null || rawPrice === undefined) return null;
      if (typeof rawPrice === 'number') return Number.isFinite(rawPrice) ? rawPrice : null;
      const parsed = parseFloat(rawPrice);
      return Number.isFinite(parsed) ? parsed : null;
    })
    .filter((price: number | null): price is number => price !== null && price > 0);

  const mintPriceRangeDisplay = validMintPrices.length
    ? (() => {
        const minPrice = Math.min(...validMintPrices);
        const maxPrice = Math.max(...validMintPrices);
        return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
      })()
    : null;

  const handleStampSelect = (stamp: any) => {
    const instances = normalizedStamps.filter(s => s.parentStampId === stamp.id);
    setSelectedStamp({
      ...stamp,
      instances,
    });
  };

  return (
    <div className="fade-in">
      {/* Back Button and Header */}
      <div className="sticky top-0 z-10 flex md:items-center md:justify-between flex-col md:flex-row gap-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4 mb-2">
        <div>
          <button
            onClick={onBack}
            className="flex items-center theme-text-primary hover:opacity-80 transition-colors duration-300 mr-6 theme-card border-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-xs md:text-sm font-semibold"
          >
            <svg className="w-3 h-3 mr-1 md:w-5 md:h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Types
          </button>
        </div>

        {/* Modern Breadcrumb Navigation */}
        <div className="flex items-center">
          {/* Mobile breadcrumb */}
          <div className="md:hidden flex items-center">
            <nav className="flex items-center text-xs">
              <button
                onClick={onBackHome}
                className="inline-flex items-center mx-2 py-1 rounded-md text-stamp-royal-600 hover:text-stamp-primary hover:bg-stamp-royal-50 transition-all duration-200 font-medium"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Series
              </button>
              <span className="mx-1 text-stamp-royal-300">/</span>
              <button
                onClick={onBack}
                className="inline-flex items-center mx-2 py-1 rounded-md text-stamp-royal-600 hover:text-stamp-primary hover:bg-stamp-royal-50 transition-all duration-200 font-medium truncate max-w-[80px]"
              >
                {series.name}
              </button>
              <span className="mx-1 text-stamp-royal-300">/</span>
              <span className="font-semibold text-stamp-primary truncate max-w-[80px] mx-2 py-1">
                {types.name}
              </span>
            </nav>
          </div>

          {/* Desktop breadcrumb */}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center space-x-1 text-sm">
              <div className="flex items-center">
                <button
                  onClick={onBackHome}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="truncate max-w-[150px]">{series.name}</span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="font-semibold text-stamp-primary text-sm truncate max-w-[150px]">
                    {types.name}
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Types Header */}
      <div className="theme-card border-2 rounded-2xl shadow-lg p-4 md:p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center text-sm text-stamp-royal-500 mb-2">
              <span>{series.name}</span>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{types.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold theme-text-primary mb-2">
              {series.name}
            </h1>
            <p className="theme-text-secondary text-sm md:text-lg mb-4">
              {types.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-stamp-gold-500 bg-opacity-20 text-stamp-primary text-center">
                Year: {types.year}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-stamp-red-500 bg-opacity-20 text-stamp-red-600 text-center">
                {sortedStamps.length} Stamps
              </span>
              {mintPriceRangeDisplay && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800 text-center">
                  Price Range: {mintPriceRangeDisplay}
                </span>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex theme-card rounded-lg p-1 border w-full md:w-auto">
            <button
              onClick={() => {
                setActiveTab('grid');
              }}
              className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 flex-1 md:flex-none ${activeTab === 'grid'
                  ? 'theme-card theme-text-primary shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
                }`}
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 inline mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden sm:inline">Grid View</span>
              <span className="sm:hidden">Grid</span>
            </button>
            <button
              onClick={() => {
                console.log('Table tab clicked');
                setActiveTab('table');
              }}
              className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 flex-1 md:flex-none ${activeTab === 'table'
                  ? 'theme-card theme-text-primary shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
                }`}
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 inline mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0V17m0-10a2 2 0 012-2h2a2 2 0 002 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
              </svg>
              <span className="hidden sm:inline">Table View</span>
              <span className="sm:hidden">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {/* Debug Info */}
        <div className="text-sm text-stamp-primary bg-stamp-royal-100 p-2 rounded">
          Stamps Count: {sortedStamps.length}
          {mintPriceRangeDisplay ? ` • Price Range: ${mintPriceRangeDisplay}` : ''}
        </div>

        {activeTab === 'grid' && (
          <StampGrid
            stamps={sortedStamps}
            onStampSelect={handleStampSelect}
            selectedStamp={selectedStamp}
          />
        )}

        {activeTab === 'table' && (
          <StampTable stamps={sortedStamps} onStampSelect={handleStampSelect} />
        )}
      </div>

      {/* Selected Stamp Details Modal */}
      {selectedStamp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] min-h-[400px] overflow-y-auto scrollbar-thin">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Stamp Details
                </h3>
                <button
                  onClick={() => setSelectedStamp(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Stamp Image and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-stamp-royal-100 rounded-xl p-4">
                    <div className="relative">
                      <img
                        src={selectedStamp.image}
                        alt={`${selectedStamp.denomination} stamp`}
                        className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                        onError={(e: any) => {
                          e.target.src = '/images/stamps/no-image-available.png';
                        }}
                      />
                      <button
                        onClick={() => setEnlargedImage(selectedStamp.image)}
                        className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                        title="View larger image"
                      >
                        <Maximize2 className="w-4 h-4 text-stamp-primary" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-stamp-primary mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stamp-royal-600">Catalog Number:</span>
                        <span className="font-medium uppercase">{selectedStamp.catalogNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stamp-royal-600">Denomination:</span>
                        <span className="font-medium">{selectedStamp.denomination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stamp-royal-600">Color:</span>
                        <span className="font-medium">{selectedStamp.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stamp-royal-600">Year:</span>
                        <span className="font-medium">{selectedStamp.year}</span>
                      </div>
                      {selectedStamp.notes && (
                        <div className="flex justify-between">
                          <span className="text-stamp-royal-600">Notes:</span>
                          <span className="font-medium">{selectedStamp.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-stamp-primary mb-3">Market Prices</h4>
                    <div className="bg-stamp-royal-100 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stamp-royal-600">Mint:</span>
                          <span className="font-bold text-green-600">${selectedStamp.prices.mint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stamp-royal-600">Fine Used:</span>
                          <span className="font-bold text-blue-600">${selectedStamp.prices.fineUsed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stamp-royal-600">Used:</span>
                          <span className="font-bold text-orange-600">${selectedStamp.prices.used}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stamp Instances Section */}
              {selectedStamp.instances && selectedStamp.instances.length > 0 ? (
                <div className="mt-8 theme-card border-2 border-stamp-royal-300 rounded-xl shadow-lg p-4">
                  <h4 className="text-lg font-bold theme-text-primary mb-3 flex items-center">
                    <Layers className="w-4 h-4 mr-2 text-stamp-primary" />
                    Stamp Instances
                  </h4>
                  <p className="theme-text-secondary mb-4 text-xs leading-relaxed">
                    Discover the different varieties and instances of this stamp with their catalog values.
                  </p>

                  <div className="border border-stamp-royal-300 rounded-lg overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-stamp-royal-200">
                        <thead className="bg-stamp-royal-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-stamp-primary uppercase tracking-wider">Instance</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-stamp-primary uppercase tracking-wider">Mint</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-stamp-primary uppercase tracking-wider">Fine Used</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-stamp-primary uppercase tracking-wider">Used</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stamp-royal-200">
                          {selectedStamp.instances.map((instance: any) => (
                            <tr key={instance.id} className="hover:bg-stamp-royal-50 transition-colors">
                              <td className="px-4 py-3 font-medium text-stamp-primary">
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium">
                                    {(instance as any).name}
                                    {(instance as any).catalogNumber && (instance as any).catalogNumber !== '-' ? ` (${(instance as any).catalogNumber})` : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded">
                                  {instance.mintValue ? `$${instance.mintValue}` : '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded">
                                  {instance.finestUsedValue ? `$${instance.finestUsedValue}` : '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded">
                                  {instance.usedValue ? `$${instance.usedValue}` : '-'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-3 p-3">
                      {selectedStamp.instances.map((instance: any) => (
                        <div key={instance.id} className="bg-stamp-royal-50 rounded-lg p-3 border border-stamp-royal-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <span className="font-medium text-stamp-primary text-sm">
                                {(instance as any).name}
                                {(instance as any).catalogNumber && (instance as any).catalogNumber !== '-' ? ` (${(instance as any).catalogNumber})` : ''}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="text-stamp-royal-600 mb-1">Mint</div>
                              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded block">
                                {instance.mintValue ? `$${instance.mintValue}` : '-'}
                              </span>
                            </div>
                            <div className="text-center">
                              <div className="text-stamp-royal-600 mb-1">Fine Used</div>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded block">
                                {instance.finestUsedValue ? `$${instance.finestUsedValue}` : '-'}
                              </span>
                            </div>
                            <div className="text-center">
                              <div className="text-stamp-royal-600 mb-1">Used</div>
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded block">
                                {instance.usedValue ? `$${instance.usedValue}` : '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : selectedStamp.instances && selectedStamp.instances.length === 0 ? (
                <div className="mt-8 theme-card border-2 border-stamp-royal-300 rounded-xl shadow-lg p-4">
                  <h4 className="text-lg font-bold theme-text-primary mb-3 flex items-center">
                    <Layers className="w-4 h-4 mr-2 text-stamp-primary" />
                    Stamp Instances
                  </h4>

                  {/* Empty State */}
                  <div className="flex flex-col items-center justify-center py-8 px-4">
                    <div className="w-16 h-16 bg-stamp-royal-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-stamp-royal-400" />
                    </div>
                    <h5 className="text-lg font-semibold theme-text-primary mb-2">No Instances Available</h5>
                    <p className="theme-text-secondary text-sm text-center max-w-md leading-relaxed">
                      This stamp doesn't have multiple instances or varieties catalogued. The main stamp information shows the primary catalog details.
                    </p>
                    <div className="mt-4 px-3 py-1.5 bg-stamp-royal-100 rounded-full">
                      <span className="text-xs font-medium text-stamp-royal-600">
                        Single Instance Stamp
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-2xl p-2 shadow-2xl">
              <img
                src={enlargedImage}
                alt="Enlarged stamp"
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
                onError={(e: any) => {
                  e.target.src = '/images/stamps/no-image-available.png';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StampView;
