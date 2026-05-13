function stripIdSuffixes(data) {
    if (Array.isArray(data)) return data.map(stripIdSuffixes);
    if (data && typeof data === 'object') {
        const cleaned = {};
        for (const [key, value] of Object.entries(data)) {
            // Si el campo termina en 'Id' (como categoriaId), lo omitimos en la respuesta
            if (key.endsWith('Id')) continue; 
            cleaned[key] = stripIdSuffixes(value);
        }
        return cleaned;
    }
    return data;
}

module.exports = (req, res, next) => {
    const originalJson = res.json.bind(res);
    // Sobrescribimos el método res.json de Express
    res.json = (body) => originalJson(stripIdSuffixes(body));
    next();
};