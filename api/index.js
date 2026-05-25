module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { zip, country = "us" } = req.query;
    if (!zip) return res.status(400).json({ 
      error: 'Missing?zip= parameter', 
      example: '/api?zip=90210',
      global_example: '/api?zip=SW1A&country=gb'
    });

    const url = `https://api.zippopotam.us/${country}/${zip}`;
    const geoRes = await fetch(url);
    
    if (!geoRes.ok) {
      return res.status(404).json({ 
        error: 'ZIP not found', 
        zip: zip,
        country: country.toUpperCase(),
        hint: 'Try US: 90210, 10001. UK: SW1A, E1. CA: K1A'
      });
    }
    
    const data = await geoRes.json();
    const place = data.places[0];
    
    return res.json({
      zip_code: data['post code'],
      country: data.country,
      country_abbreviation: data['country abbreviation'],
      city: place['place name'],
      state: place['state'],
      state_abbreviation: place['state abbreviation'],
      latitude: parseFloat(place['latitude']),
      longitude: parseFloat(place['longitude']),
      source: "Zippopotam.us"
    });
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Lookup failed', 
      details: error.message 
    });
  }
};
