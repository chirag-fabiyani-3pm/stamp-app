import { NextRequest, NextResponse } from 'next/server';
import { stampDataById } from "@/app/catalog/[stampId]/page";

// Knowledge base with stamp collecting information
const stampKnowledge = {
  terminology: {
    perforation: "Perforation refers to the small holes punched between stamps to make them easier to separate.",
    watermark: "A watermark is a design or pattern pressed into paper during manufacturing, visible when held to light.",
    denomination: "The denomination is the monetary value printed on a stamp.",
    mint: "Mint condition means the stamp is unused and has its original gum.",
    used: "Used stamps have been through the postal system and usually bear cancellation marks.",
    "first day cover": "An envelope or card bearing stamps canceled on the first day of issue.",
    hingeless: "A stamp that has never been hinged and retains its full original gum.",
    imperforate: "Stamps without perforations, which must be cut or torn to separate.",
    overprint: "Additional text or values printed over the original stamp design.",
    "se-tenant": "Different stamp designs printed on the same sheet and attached to each other.",
  },
  collecting: {
    storage: "Store stamps in albums with acid-free pages or stock books. Never use ordinary adhesives or tape.",
    handling: "Always use stamp tongs to handle stamps, never your fingers. Oils from skin can damage stamps.",
    lighting: "Keep stamps away from direct sunlight to prevent fading.",
    humidity: "Store stamps in a cool, dry place. Excessive humidity can damage the paper and gum.",
    mounting: "Use proper stamp mounts or hinges designed specifically for philatelic use.",
    valuation: "Stamp values are determined by rarity, condition, centering, color, and market demand.",
    grading: "Common grades include Poor, Good, Fine, Very Fine, Extremely Fine, and Superb.",
    catalogs: "Major catalog publishers include Scott, Stanley Gibbons, Michel, and Yvert et Tellier.",
  },
  series: {
    "chalon heads": "The Chalon Heads (or Full Face Queens) were New Zealand's first stamps issued from 1855-1873, featuring Queen Victoria.",
    "penny black": "The Penny Black was the world's first adhesive postage stamp, issued in Great Britain in 1840.",
    "side face queens": "Side Face Queens were the second major issue of New Zealand stamps featuring Queen Victoria in profile (1873-1892).",
    "first pictorials": "New Zealand's First Pictorials (1898-1908) featured landscapes, native birds, and cultural scenes instead of the monarch.",
    "australian kangaroo": "The Kangaroo and Map series (1913-1946) were the first stamps of unified Australia.",
    "kgv heads": "King George V Heads were an Australian definitive series (1914-1936) featuring the monarch in profile.",
    "silver jubilee": "The 1935 Silver Jubilee series commemorated King George V's 25th year on the throne.",
    "seahorses": "Seahorses High Values were British stamps (1913-1934) showing Britannia riding seahorses.",
    "prexies": "The Presidential Series (Prexies) was a US definitive series (1938-1954) featuring portraits of presidents.",
    "penny red": "The Penny Red (1841-1879) was the successor to the Penny Black in Great Britain.",
    "machin definitives": "Machin Definitives feature an iconic portrait of Queen Elizabeth II, in use since 1967.",
    "ross dependency": "Ross Dependency issues are stamps issued by New Zealand for use in its Antarctic territory since 1957.",
  }
};

// Helper function to search our stamp knowledge base
function searchStampKnowledge(query: string): string | null {
  query = query.toLowerCase();
  
  // Check terminology
  for (const [term, definition] of Object.entries(stampKnowledge.terminology)) {
    if (query.includes(term.toLowerCase())) {
      return `${term.toUpperCase()}: ${definition}`;
    }
  }
  
  // Check collecting advice
  for (const [topic, advice] of Object.entries(stampKnowledge.collecting)) {
    if (query.includes(topic.toLowerCase())) {
      return advice;
    }
  }
  
  // Check series information
  for (const [series, info] of Object.entries(stampKnowledge.series)) {
    if (query.includes(series.toLowerCase())) {
      return info;
    }
  }
  
  // If nothing specific is found, search for stamp by name
  for (const [seriesId, seriesData] of Object.entries(stampDataById)) {
    if (seriesData.name && seriesData.name.toLowerCase().includes(query)) {
      return `${seriesData.name}: ${seriesData.description}`;
    }
    
    // Check individual stamps in this series
    if (seriesData.stamps) {
      for (const stamp of seriesData.stamps) {
        if (stamp.name && stamp.name.toLowerCase().includes(query)) {
          return `${stamp.name} (${stamp.year}): ${stamp.description}. Denomination: ${stamp.denomination}.`;
        }
      }
    }
  }
  
  return null;
}

// Function to generate a helpful response based on the query
function generateResponse(query: string): string {
  // Clean up the query
  query = query.trim().toLowerCase();
  
  // Check for greetings
  if (query.match(/^(hi|hello|hey|greetings).*/i)) {
    return "Hello! I'm your stamp collecting assistant. How can I help you today?";
  }
  
  // Check for thanks
  if (query.match(/^(thanks|thank you|thx).*/i)) {
    return "You're welcome! Feel free to ask if you have more questions about stamps.";
  }
  
  // Check for goodbyes
  if (query.match(/^(bye|goodbye|see you).*/i)) {
    return "Goodbye! Happy stamp collecting!";
  }
  
  // Check for specific knowledge
  const knowledgeResult = searchStampKnowledge(query);
  if (knowledgeResult) {
    return knowledgeResult;
  }
  
  // Check for questions about value
  if (query.includes("worth") || query.includes("value") || query.includes("price") || query.includes("cost")) {
    return "Stamp values depend on many factors including condition, rarity, and demand. For an accurate valuation, consider consulting a professional appraiser or reference the latest stamp catalogs like Scott, Stanley Gibbons, or Michel.";
  }
  
  // Check for identification questions
  if (query.includes("identify") || query.includes("what stamp is") || query.includes("what is this stamp")) {
    return "To identify a stamp, I'd need to see an image. In our app, you can use the stamp scanner feature to help identify stamps in your collection. Key details that help with identification include country, year, denomination, color, and any distinctive design elements.";
  }
  
  // Check for how to start collecting
  if (query.includes("start collecting") || query.includes("begin collecting") || query.includes("new collector")) {
    return "Starting a stamp collection is easy! Begin by deciding what to collect - you might focus on a country, time period, or theme. Get basic supplies like tongs, a stock book, and a magnifying glass. Join a local philatelic society or online forums to learn from experienced collectors. Our app's catalog is also a great resource for beginners!";
  }
  
  // Default response for unknown queries
  return "I don't have specific information about that, but I'd be happy to help with questions about stamp terminology, collecting advice, or information about major stamp series in our catalog. You can also explore specific stamps in our app's catalog section.";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Generate a response based on the user's message
    const response = generateResponse(message);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in stamp-bot API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 