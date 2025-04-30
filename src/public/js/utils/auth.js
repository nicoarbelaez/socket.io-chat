const CookieManager = {
  async set(name, value) {
    const day = Date.now() + 24 * 60 * 60 * 1000;
    await cookieStore.set({
      name,
      value,
      expires: day,
    });
  },

  async get(name) {
    return await cookieStore.get(name);
  },

  async clear(name) {
    await cookieStore.delete(name);
  },
};

export default CookieManager;
