const CookieManager = {
  async setUsername(username) {
    const day = Date.now() + 24 * 60 * 60 * 1000;
    await cookieStore.set({
      name: 'username',
      value: username,
      expires: day,
    });
  },

  async getUsername() {
    return await cookieStore.get('username');
  },

  async clearSession() {
    await cookieStore.delete('username');
  },
};

export default CookieManager;
