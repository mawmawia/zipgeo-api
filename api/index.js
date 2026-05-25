module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // STATUS ENDPOINT - The "pro" move
  if (req.url.includes('/status')) {
    return res.json({
      status: "ok",
      uptime: "100%",
      version: "1.0.0",
      docs: "https://zipgeo-api-c7hu.vercel.app"
    });
  }

  try {
    const { zip, country = "us" } = req.query;
    if (!zip) return res.status(400).json({
      error: 'Missing required parameter: zip',
      example: '/api?zip=90210&country=us'
    });

    const url = `https://api.zippopotam.us/${country}/${zip}`;
    const geoRes = await fetch(url);

    if (!geoRes.ok) {
      return res.status(404).json({
        error: 'ZIP not found',
        zip: zip,
        country: country.toUpperCase(),
        status: 404
      });
    }

    const data = await geoRes.json();
    const place = data.places[0];

    // FLATTENED RESPONSE GUARANTEE - This is the money
    return res.json({
      zip: data['post code'],
      country: data.country,
      country_code: data['country abbreviation'],
      city: place['place name'],
      state: place['state'],
      state_code: place['state abbreviation'],
      latitude: parseFloat(place['latitude']),
      longitude: parseFloat(place['longitude']),
      source: "Zippopotam.us"
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Lookup failed',
      status: 500
    });
  }
};
