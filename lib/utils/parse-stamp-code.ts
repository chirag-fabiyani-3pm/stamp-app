export type ParsedStampCode = {
  countryCode: string
  actualSeriesName: string
  year: number
  currencyCode: string
  denominationValue: string
  colorCode: string
  paperCode: string
  watermarkCode: string
  perforationCode: string
  itemTypeCode: string
}

export function parseStampCode(stampCode: string): ParsedStampCode {
  const parts = (stampCode || "").split('|||')

  const countryCode = parts[0] || ''
  const encodedSeriesName = decodeURIComponent(parts[1] || '')
  const year = parseInt(parts[2] || '0')
  const currencyCode = parts[3] || ''
  const denominationPart = parseFloat(parts[4]).toString() || ''
  const colorCode = parts[5] || ''
  const paperCode = parts[6] || ''
  const watermarkCode = parts[7] || ''
  const perforationCode = parts[8] || ''
  const itemTypeCode = parts[9] || ''

  return {
    countryCode,
    actualSeriesName: encodedSeriesName,
    year,
    currencyCode,
    denominationValue: denominationPart,
    colorCode,
    paperCode,
    watermarkCode,
    perforationCode,
    itemTypeCode
  }
}

/**
 * Generates a stamp code from StampData or ApiStampData objects
 * This is a convenience function that converts the catalog types to StampObject format
 */
export function generateStampCodeFromCatalogData(stamp: any): string {
  // Convert to StampObject format
  const stampObject = {
    countryCode: stamp.countryCode || stamp.country || '',
    seriesName: stamp.seriesName || '',
    issueYear: stamp.issueYear || '',
    currencyCode: stamp.currencyCode || '',
    denominationSymbol: stamp.denominationSymbol || '',
    denominationValue: stamp.denominationValue || 0,
    color: stamp.colorCode || '',
    paper: stamp.paperCode || '',
    watermark: stamp.watermarkCode || '',
    perforation: stamp.perforationCode || '',
    itemType: stamp.itemTypeCode || '',
    categoryCode: stamp.categoryCode || ''
  }

  return `${stampObject.countryCode}${stampObject.seriesName ? `.${stampObject.seriesName}` : ''}${stampObject.issueYear ? `.${stampObject.issueYear}` : ''}${stampObject.currencyCode ? `.${stampObject.currencyCode}` : ''}${stampObject.denominationSymbol && stampObject.denominationValue ? `.${stampObject.denominationValue}${stampObject.denominationSymbol}` : ''}${stampObject.color ? `.${stampObject.color}` : ''}${stampObject.paper ? `.${stampObject.paper}` : ''}${stampObject.watermark ? `.${stampObject.watermark}` : ''}${stampObject.perforation ? `.${stampObject.perforation}` : ''}${stampObject.itemType ? `.${stampObject.itemType}` : ''}${stampObject.categoryCode ? `.${stampObject.categoryCode}` : ''}`
}


