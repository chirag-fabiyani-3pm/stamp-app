import { Table } from 'lucide-react';
import React, { useState } from 'react';

const StampTable = ({ stamps, onStampSelect }: any) => {
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'asc' });

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

  return (
    <div className="theme-card border-2 rounded-2xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 theme-card border-b theme-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold theme-text-primary flex gap-2 items-center">
            <Table />
            Stamp Details Table
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
                  <span>Catalog No.</span>
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
                onClick={() => onStampSelect(stamp)}
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
                  <div className="text-sm font-medium text-stamp-primary min-w-28">{stamp.catalogNumber?.toUpperCase()}</div>
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
                  <div className="text-sm font-semibold text-green-600 min-w-28">${stamp.prices.mint}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600 min-w-28">${stamp.prices.fineUsed}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-orange-600 min-w-28">${stamp.prices.used}</div>
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
    </div>
  );
};

export default StampTable;