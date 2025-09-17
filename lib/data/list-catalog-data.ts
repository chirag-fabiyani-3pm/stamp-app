import { ParsedStampDetails, StampData, StampDetailData } from "@/types/catalog"

export const parseStampDetails = (stampDetailsJson: string): ParsedStampDetails => {
  try {
    const details = JSON.parse(stampDetailsJson);
    
    // Direct mapping from apiStampData fields to ParsedStampDetails
    return {
      perforation: details.perforation || details.perforationName || 'Unknown',
      watermark: details.watermark || details.watermarkName || 'None',
      printingMethod: details.printingMethod || 'Unknown',
      paperType: details.paperType || details.paperName || 'Standard',
      rarityRating: details.rarityRating || 'Common',
      catalogPrice: details.catalogPrice,
      estimatedValue: details.estimatedMarketValue,
      currentMarketValue: details.currentMarketValue,
      condition: details.conditionNotes || 'Unknown',
      usage: 'Unknown', // No direct mapping in apiStampData
      errorType: details.errorType as string || 'None',
      specialNotes: details.specialNotes,
      rarity: details.rarityRating,
      varieties: details.varietyType ? details.varietyType.split(',').map((v: string) => v.trim()) : [],
      errors: details.knownError ? [details.knownError] : [],
    };
  } catch (error) {
    console.error('Error parsing stamp details:', error);
    return {
      perforation: 'Unknown',
      watermark: 'None',
      printingMethod: 'Unknown',
      paperType: 'Standard',
      gum: 'Original gum',
      size: 'Standard',
      rarityRating: 'Common'
    };
  }
};

export const createStampDetailData = (stamp: StampData): StampDetailData => {
  const parsedDetails = parseStampDetails(stamp.stampDetailsJson)
  
  return {
    ...stamp,
    parsedDetails,
    relatedStamps: [], // This would require more logic to find related stamps
    varieties: {
      perforations: parsedDetails.perforation ? [parsedDetails.perforation] : [],
      colors: stamp.color ? [stamp.color] : [],
      paperTypes: parsedDetails.paperType ? [parsedDetails.paperType] : [],
      errors: parsedDetails.errors || []
    },
    marketInfo: {
      rarity: parsedDetails.rarityRating || 'Common'
    },
    bibliography: parsedDetails.bibliography || `Catalog Entry: ${stamp.catalogNumber}\n\nIssue Details:\nThe ${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color} stamp from the ${stamp.catalogNumber.startsWith('CP') ? 'Campbell Paterson' : 'Stanley Gibbons'} catalog. This stamp represents part of a comprehensive stamp group showcasing various themes.\n\nTechnical Specifications:\n• Perforation: ${parsedDetails.perforation || 'Unknown'}\n• Printing Method: ${parsedDetails.printingMethod || 'Unknown'}\n• Paper Type: ${parsedDetails.paperType || 'Unknown'}\n• Watermark: ${parsedDetails.watermark || 'Unknown'}\n• Gum Type: ${parsedDetails.gum || 'Unknown'}\n• Print Run: Unknown\n\nCollector Notes:\nThis stamp has a rarity rating of "${parsedDetails.rarityRating || 'Common'}" among collectors. The ${stamp.color || 'Unknown'} color variant is particularly sought after for its vibrant hues and precise registration.\n\nVarieties and Errors:\n${parsedDetails.varieties && parsedDetails.varieties.length > 0 ? `Known varieties include: ${parsedDetails.varieties.join(', ')}.` : 'No major varieties are currently documented.'} ${parsedDetails.errors && parsedDetails.errors.length > 0 ? `Known errors include: ${parsedDetails.errors.join(', ')}.` : ''} While no major varieties are currently documented, collectors should examine copies for minor plate flaws or color variations that may increase collectible value.\n\nReferences:\n• Official Postal Service Records\n• Specialized Philatelic Catalogues\n• Contemporary Collector Surveys`
  }
} 