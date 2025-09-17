import React, { useState } from 'react';
import StampGrid from './stamp-grid';
import StampTable from './stamp-table';
import { Layers, Package } from 'lucide-react';
import { useCatalogData } from '@/lib/context/catalog-data-context';

const StampView = ({ series, types, onBack, onBackHome }: any) => {
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedStamp, setSelectedStamp] = useState<any>(null);
  const { normalizedStamps } = useCatalogData();

  const sortedStamps = types.stamps ? [...types.stamps].sort((a, b) => a.year - b.year) : [];

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
      <div className="flex items-center mb-8 justify-between">
        <button
          onClick={onBack}
          className="flex items-center theme-text-primary hover:opacity-80 transition-colors duration-300 mr-6 theme-card border-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Types
        </button>

        <div className="hidden md:flex items-center space-x-2 text-sm">
          <button
            onClick={onBackHome}
            className={`font-medium transition-colors duration-200 theme-accent hover:opacity-80 cursor-pointer`}
          >
            Series
          </button>
          <>
            <span className="theme-accent">/</span>
            <button
              className={`font-medium transition-colors duration-200 theme-accent hover:opacity-80 cursor-pointer`}
              onClick={onBack}
            >
              {series.name}
            </button>
          </>
          <>
            <span className="theme-accent">/</span>
            <span className="text-stamp-gold-400 font-medium">
              {types.name}
            </span>
          </>
        </div>
      </div>

      {/* Types Header */}
      <div className="theme-card border-2 rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center text-sm text-stamp-royal-500 mb-2">
              <span>{series.name}</span>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{types.name}</span>
            </div>
            <h1 className="text-3xl font-bold theme-text-primary mb-2">
              {series.name}
            </h1>
            <p className="theme-text-secondary text-lg mb-4">
              {types.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stamp-gold-500 bg-opacity-20 text-stamp-primary">
                Year: {types.year}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stamp-red-500 bg-opacity-20 text-stamp-red-600">
                {sortedStamps.length} Stamps
              </span>
              {sortedStamps.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Price Range: ${Math.min(...sortedStamps.map(s => s.prices.mint))} - ${Math.max(...sortedStamps.map(s => s.prices.mint))}
                </span>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex theme-card rounded-lg p-1 border">
            <button
              onClick={() => {
                setActiveTab('grid');
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'grid'
                  ? 'theme-card theme-text-primary shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
                }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid View
            </button>
            <button
              onClick={() => {
                console.log('Table tab clicked');
                setActiveTab('table');
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'table'
                  ? 'theme-card theme-text-primary shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
                }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0V17m0-10a2 2 0 012-2h2a2 2 0 002 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
              </svg>
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {/* Debug Info */}
        <div className="text-sm text-stamp-primary bg-stamp-royal-100 p-2 rounded">
          Stamps Count: {sortedStamps.length}
        </div>

        {activeTab === 'grid' && (
          <StampGrid
            stamps={sortedStamps}
            onStampSelect={handleStampSelect}
            selectedStamp={selectedStamp}
          />
        )}

        {activeTab === 'table' && (
          <StampTable stamps={sortedStamps} />
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
                    <img
                      src={selectedStamp.image}
                      alt={`${selectedStamp.denomination} stamp`}
                      className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=260&fit=crop&crop=center';
                      }}
                    />
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
    </div>
  );
};

export default StampView;
