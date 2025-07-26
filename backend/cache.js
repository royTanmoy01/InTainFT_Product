// Simple in-memory cache for Google Places API
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 });
export { cache };
