const cachePublic = (seconds) => (req, res, next) => {
  if (req.method === "GET" && !req.headers.authorization) {
    res.set(
      "Cache-Control",
      `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 5}`,
    );
  }
  next();
};

module.exports = { cachePublic };
