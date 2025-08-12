export type ParsedStampCode = {
  countryCode: string
  actualSeriesName: string
  year: number
  currencyCode: string
  denominationValue: string
  remainingParts: string[]
  colorCode: string
  paperCode: string
  watermarkCode: string
  perforationCode: string
  itemTypeCode: string
}

export function parseStampCode(stampCode: string): ParsedStampCode {
  const parts = (stampCode || "").split('.')

  const countryCode = parts[0] || ''
  const encodedSeriesName = parts[1] || ''
  const year = parseInt(parts[2] || '0')
  const currencyCode = parts[3] || ''

  // Handle decimal in denomination: parts[4] = "1", parts[5] = "5d" -> "1.5d"
  let denominationPart = parts[4] || ''
  let nextIndex = 5

  // Check if the next part starts with a digit (indicating it's part of the decimal)
  if (parts[5] && /^\d/.test(parts[5])) {
    denominationPart = `${parts[4] || ''}.${parts[5]}`
    nextIndex = 6
  }

  const denominationValue = denominationPart.replace(/[^\d.]/g, '')
  const actualSeriesName = decodeURIComponent(encodedSeriesName)

  // Extract remaining path components and handle additional decimal points
  const remainingParts: string[] = []
  let i = nextIndex

  while (i < parts.length) {
    let currentPart = parts[i] || ''

    // Check if next part could be a decimal continuation
    // This handles cases like watermark "W.7" being split into "W" and "7"
    if (i + 1 < parts.length && /^\d+$/.test(parts[i + 1])) {
      // If current part is a letter/code and next is purely numeric, combine them
      currentPart = `${parts[i] || ''}.${parts[i + 1]}`
      i += 2 // Skip both parts
    } else {
      i += 1
    }

    remainingParts.push(currentPart)
  }

  return {
    countryCode,
    actualSeriesName,
    year,
    currencyCode,
    denominationValue,
    remainingParts,
    // Legacy support - map to indexed positions for existing code
    colorCode: remainingParts[0] || '',
    paperCode: remainingParts[1] || '',
    watermarkCode: remainingParts[2] || '',
    perforationCode: remainingParts[3] || '',
    itemTypeCode: remainingParts[4] || ''
  }
}


