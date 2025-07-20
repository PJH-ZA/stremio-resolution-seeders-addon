const { addonBuilder } = require('stremio-addon-sdk');
// node-fetch v2 requires .default
const fetch = require('node-fetch').default;

// Manifest
const manifest = {
  id: 'org.example.resseedaddon',
  version: '1.0.0',
  name: 'Resolution & Seeders',
  description: 'Filters external stream sources to show only resolution and connection info.',
  resources: ['stream'],
  types: ['movie', 'series'],
  catalogs: []
};

const builder = new addonBuilder(manifest);

// Configure your external stream sources here or via ENV
const EXTERNAL_STREAM_SOURCES = process.env.EXTERNAL_STREAM_SOURCES ?
  process.env.EXTERNAL_STREAM_SOURCES.split(',') : [
    'https://api.strem.io/catalog/torrentio/stream',
    'https://api.strem.io/catalog/mediafusion/stream'
  ];

function parseResolution(stream) {
  if (stream.info && stream.info.videoResolution) {
    return String(stream.info.videoResolution).toUpperCase();
  }
  const match = String(stream.title).match(/(4K|\d{3,4}P)/i);
  return match ? match[1].toUpperCase() : 'Unknown';
}

builder.defineStreamHandler(async ({ type, id }) => {
  let collected = [];
  await Promise.all(EXTERNAL_STREAM_SOURCES.map(async (endpoint) => {
    try {
      const url = `${endpoint}?type=${type}&id=${encodeURIComponent(id)}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Stream fetch ${endpoint} returned status ${res.status}`);
        return;
      }
      const json = await res.json();
      if (Array.isArray(json.streams)) collected.push(...json.streams);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
    }
  }));

  const streams = collected.map((stream) => {
    const resolution = parseResolution(stream);
    const seeders = (stream.info && (stream.info.seeds || stream.info.seeders)) || 0;
    const connection = seeders > 1 ? 'Available' : 'Unavailable';
    return {
      title: `Resolution: ${resolution}\nConnection: ${connection}`,
      url: stream.url
    };
  });

  return { streams };
});

const addonInterface = builder.getInterface();

module.exports = (req, res) => {
  try {
    console.log(`Incoming ${req.method} ${req.url}`);
    return addonInterface(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
