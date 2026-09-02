const fs = require('fs');
const path = require('path');

const SCRYFALL_API = 'https://api.scryfall.com/sets';
const RSS_FEED_URL = 'https://www.mtggoldfish.com/feed';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'events.json');

// Security first: A dedicated User-Agent is requested for Scryfall compliance.
const USER_AGENT = 'MTGTimeline/1.0 (contact@example.com) Node.js/20-Automation';

// Helper to add a delay between requests (rate-limiting compliance)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to decode basic XML entities to prevent double-encoding/display issues
function decodeXMLEntities(str) {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * Fetch and parse Scryfall sets.
 */
async function fetchScryfallSets() {
  console.log('Fetching Scryfall sets...');
  const response = await fetch(SCRYFALL_API, {
    method: 'GET',
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const ALLOWED_TYPES = new Set(['core', 'expansion', 'masters', 'commander', 'draft_innovation']);
  
  const parsedSets = [];
  
  if (Array.isArray(data.data)) {
    for (const set of data.data) {
      if (ALLOWED_TYPES.has(set.set_type) && set.digital === false) {
        // Enforce strict types as a security/resiliency measure
        parsedSets.push({
          id: String(set.id || ''),
          name: String(set.name || ''),
          code: String(set.code || ''),
          releaseDate: String(set.released_at || '1970-01-01'),
          iconUri: String(set.icon_svg_uri || ''),
          cardCount: Number(set.card_count || 0),
          type: 'set',
          setType: String(set.set_type || '')
        });
      }
    }
  }
  
  return parsedSets;
}

/**
 * Fetch and parse MTGGoldfish RSS feed.
 */
async function fetchRssFeed() {
  console.log('Fetching MTGGoldfish RSS feed...');
  try {
    const response = await fetch(RSS_FEED_URL, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`RSS feed error: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    const items = [];
    
    // Minimal secure Regex for a standard RSS <item> block.
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    
    // Extract top 10 items
    while ((match = itemRegex.exec(xmlText)) !== null && items.length < 10) {
      const itemContent = match[1];
      
      let title = '';
      const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      if (titleMatch) title = decodeXMLEntities(titleMatch[1].trim());
      
      let url = '';
      const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      if (linkMatch) url = linkMatch[1].trim();

      let guid = url; // Fallback to URL if guid is missing
      const guidMatch = itemContent.match(/<guid(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/guid>/i);
      if (guidMatch) guid = guidMatch[1].trim();
      
      let pubDateStr = '';
      const pubDateMatch = itemContent.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
      if (pubDateMatch) pubDateStr = pubDateMatch[1].trim();
      
      if (title && url && pubDateStr) {
        const dateObj = new Date(pubDateStr);
        let releaseDate = '';
        if (!isNaN(dateObj.getTime())) {
          releaseDate = dateObj.toISOString().split('T')[0];
        } else {
          releaseDate = '1970-01-01'; // Fallback for unparseable dates
        }
        
        items.push({
          id: guid,
          name: title,
          releaseDate: releaseDate,
          type: 'announcement',
          link: url
        });
      }
    }
    
    return items;
  } catch (error) {
    console.warn(`Warning: Failed to fetch or parse RSS feed (${error.message}). Proceeding without RSS data.`);
    return []; // Return empty array to keep non-fatal flow intact
  }
}

/**
 * Main pipeline orchestration.
 */
async function main() {
  try {
    const scryfallSets = await fetchScryfallSets();
    
    // Scryfall guidelines request 50-100ms between requests. 
    // We delay here to respect good citizenship between different API queries.
    await delay(100);
    
    const rssItems = await fetchRssFeed();
    
    // Merge datasets
    const allEvents = [...scryfallSets, ...rssItems];
    
    // Sort chronologically by date (ascending)
    allEvents.sort((a, b) => {
      if (a.releaseDate < b.releaseDate) return -1;
      if (a.releaseDate > b.releaseDate) return 1;
      return 0;
    });
    
    // Ensure the output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the resulting JSON cleanly
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allEvents, null, 2), 'utf-8');
    console.log(`Successfully wrote ${allEvents.length} events to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Data pipeline error:', error.message);
    process.exit(1); // Fail the build step if there's an issue
  }
}

main();
