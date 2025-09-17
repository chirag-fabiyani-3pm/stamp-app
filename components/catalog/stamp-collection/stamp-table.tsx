import React, { useState } from 'react';
import { Layers, Package } from 'lucide-react';
import { useCatalogData } from '@/lib/context/catalog-data-context';

const StampTable = ({ stamps }: any) => {
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'asc' });
  const [selectedStamp, setSelectedStamp] = useState<any>(null);
  const { normalizedStamps, stamps: rawStamps, loading: providerLoading } = useCatalogData()

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStamps = React.useMemo(() => {
    if (!stamps) return [];
    
    const sortableStamps = [...stamps];
    sortableStamps.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested price sorting
      if (sortConfig.key.includes('prices.')) {
        const priceKey = sortConfig.key.split('.')[1];
        aValue = a.prices[priceKey];
        bValue = b.prices[priceKey];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortableStamps;
  }, [stamps, sortConfig]);

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-stamp-royal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-stamp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-stamp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  if (!stamps || stamps.length === 0) {
    return (
      <div className="bg-stamp-royal-50 border-2 border-stamp-royal-300 rounded-2xl shadow-lg p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 text-stamp-royal-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0V17m0-10a2 2 0 012-2h2a2 2 0 002 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-stamp-primary mb-2">No Stamps Available</h3>
          <p className="text-stamp-royal-500">This series doesn't have any stamps to display in table format.</p>
        </div>
      </div>
    );
  }

  const handleSelectedStamp = (stamp: any) => {
    const instances = normalizedStamps.filter(s => s.parentStampId === stamp.id)
    setSelectedStamp({
      ...stamp,
      instances,
    })
  }

  return (
    <div className="theme-card border-2 rounded-2xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 theme-card border-b theme-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold theme-text-primary">
            📊 Stamp Details Table
          </h2>
          <div className="text-sm theme-text-muted">
            {sortedStamps.length} stamp{sortedStamps.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-thin" style={{ maxHeight: '70vh' }}>
        <table className="min-w-full divide-y divide-stamp-royal-300">
          <thead className="bg-stamp-royal-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider">
                Image
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider cursor-pointer hover:bg-stamp-royal-300 transition-colors duration-200"
                onClick={() => handleSort('catalogNumber')}
              >
                <div className="flex items-center space-x-1">
                  <span>Catalog #</span>
                  {getSortIcon('catalogNumber')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider cursor-pointer hover:bg-stamp-royal-300 transition-colors duration-200"
                onClick={() => handleSort('denomination')}
              >
                <div className="flex items-center space-x-1">
                  <span>Denomination</span>
                  {getSortIcon('denomination')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider cursor-pointer hover:bg-stamp-royal-300 transition-colors duration-200"
                onClick={() => handleSort('color')}
              >
                <div className="flex items-center space-x-1">
                  <span>Color</span>
                  {getSortIcon('color')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider cursor-pointer hover:bg-stamp-royal-300 transition-colors duration-200"
                onClick={() => handleSort('year')}
              >
                <div className="flex items-center space-x-1">
                  <span>Year</span>
                  {getSortIcon('year')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider cursor-pointer hover:bg-stamp-royal-300 transition-colors duration-200"
                onClick={() => handleSort('prices.mint')}
              >
                <div className="flex items-center space-x-1">
                  <span>Mint ($)</span>
                  {getSortIcon('prices.mint')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider cursor-pointer hover:bg-stamp-royal-300 transition-colors duration-200"
                onClick={() => handleSort('prices.fineUsed')}
              >
                <div className="flex items-center space-x-1">
                  <span>Fine Used ($)</span>
                  {getSortIcon('prices.fineUsed')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider cursor-pointer hover:bg-stamp-royal-300 transition-colors duration-200"
                onClick={() => handleSort('prices.used')}
              >
                <div className="flex items-center space-x-1">
                  <span>Used ($)</span>
                  {getSortIcon('prices.used')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stamp-primary uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stamp-royal-200">
            {sortedStamps.map((stamp: any, index: number) => (
              <tr 
                key={stamp.id} 
                className={`hover:bg-stamp-royal-50 transition-colors duration-200 cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-stamp-royal-25'
                }`}
                onClick={() => handleSelectedStamp(stamp)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-16 rounded border-2 border-stamp-royal-300 overflow-hidden">
                    <img
                      src={stamp.image}
                      alt={stamp.denomination}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = '/images/stamps/no-image-available.png';
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-stamp-primary">{stamp.catalogNumber?.toUpperCase()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-stamp-primary">{stamp.denomination}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-stamp-royal-700">{stamp.color}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-stamp-royal-700">{stamp.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">${stamp.prices.mint}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600">${stamp.prices.fineUsed}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-orange-600">${stamp.prices.used}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-stamp-royal-700 max-w-xs truncate" title={stamp.notes}>
                    {stamp.notes || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 bg-stamp-royal-100 border-t border-stamp-royal-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-stamp-royal-600 mb-2 sm:mb-0">
            Click on any row to view detailed stamp information
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
              <span className="text-stamp-royal-600">Mint prices</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
              <span className="text-stamp-royal-600">Fine used prices</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-600 rounded mr-2"></div>
              <span className="text-stamp-royal-600">Used prices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Stamp Modal */}
      {selectedStamp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-h-[90vh] min-h-[400px] max-w-[95vw] sm:max-w-2xl md:max-w-4xl border-2 border-stamp-royal-300 overflow-y-auto scrollbar-thin">
            {/* Fixed Header with Close Button */}
            <div className="flex justify-end p-4 pb-2 sticky top-0 bg-white rounded-t-2xl z-10">
              <button
                onClick={() => setSelectedStamp(null)}
                className="text-stamp-royal-400 hover:text-stamp-royal-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="px-4 sm:px-6 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-stamp-primary">
                    {selectedStamp.denomination} - {selectedStamp.catalogNumber?.toUpperCase()}
                  </h3>
                </div>

                <div className="text-center mb-4">
                  <img
                    src={selectedStamp.image}
                    alt={selectedStamp.denomination}
                    className="w-32 h-40 mx-auto rounded-lg shadow-md border-2 border-stamp-royal-300"
                    onError={(e: any) => {
                      e.target.src = '/images/stamps/no-image-available.png';
                    }}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stamp-royal-600">Color:</span>
                    <span className="font-medium text-stamp-primary">{selectedStamp.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stamp-royal-600">Year:</span>
                    <span className="font-medium text-stamp-primary">{selectedStamp.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stamp-royal-600">Notes:</span>
                    <span className="font-medium text-stamp-primary">{selectedStamp.notes || 'None'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stamp-royal-300">
                  <h4 className="font-semibold text-stamp-primary mb-2">Current Prices</h4>
                  <div className="space-y-1 text-sm">
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

                {/* Stamp Instances Section */}
                {selectedStamp.instances && selectedStamp.instances.length > 0 ? (
                  <div className="mt-6 theme-card border-2 border-stamp-royal-300 rounded-xl shadow-lg p-4">
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
                ) : (
                  <div className="mt-6 theme-card border-2 border-stamp-royal-300 rounded-xl shadow-lg p-4">
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
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StampTable;