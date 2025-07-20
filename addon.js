const { addonBuilder } = require('stremio-addon-sdk');
const fetch = require('node-fetch');

const manifest = {
  id: 'org.example.resseedaddon',
  version: '1.0.0',
  name: 'Resolution & Seeders',
  description: 'Filters all external stream sources to show only resolution and connection info.',
  resources: ['stream'],
  types: ['movie', 'series'],
  catalogs: [],
};

const builder = new addonBuilder(manifest);
const EXTERNAL_STREAM_SOURCES = [
  'https://api.strem.io/catalog/torrentio/stream',
  'https://api.strem.io/catalog/mediafusion/stream',
];

function parseResolution(stream) {
  if (stream.info && stream.info.videoResolution) {
    return stream.info.videoResolution.toUpperCase();
  }
  const match = stream.title.match(/(4K|\d{3,4}P)/i);
  return match ? match[1].toUpperCase() : 'Unknown';
}

builder.defineStreamHandler(async ({ type, id }) => {
  let collected = [];
  await Promise.all(EXTERNAL_STREAM_SOURCES.map(async endpoint => {
    try {
      const url = `${endpoint}?type=${type}&id=${encodeURIComponent(id)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      if (Array.isArray(json.streams)) collected.push(...json.streams);
    } catch (e) {
      console.warn(`Failed to fetch from ${endpoint}:`, e.message);
    }
  }));

  const streams = collected.map(stream => {
    const resolution = parseResolution(stream);
    const seeders = stream.info && (stream.info.seeds || stream.info.seeders)
      ? (stream.info.seeds || stream.info.seeders) : 0;
    const connection = seeders > 1 ? 'Available' : 'Unavailable';
    return {
      title: `Resolution: ${resolution}\nConnection: ${connection}`,
      url: stream.url,
    };
  });

  return { streams };
});

module.exports = builder.getInterface();
