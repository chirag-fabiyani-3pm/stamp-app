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


