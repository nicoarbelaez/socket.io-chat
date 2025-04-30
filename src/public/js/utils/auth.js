const CookieManager = {
  async set(name, value) {
    const day = Date.now() + 24 * 60 * 60 * 1000;
    await cookieStore.set({
      name,
      value,
      expires: day,
    });
  },

  async getAll() {
    return await cookieStore.getAll();
  },

  async get(name) {
    return await cookieStore.get(name);
  },

  async clear(name) {
    await cookieStore.delete(name);
  },

  async clearAll() {
    const cookies = await cookieStore.getAll();
    await Promise.all(cookies.map((cookie) => cookieStore.delete(cookie.name)));
  },
};

export default CookieManager;
