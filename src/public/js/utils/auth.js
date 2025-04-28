const CookieManager = {
  setUsername(username) {
    const date = new Date();
    date.setTime(date.getTime() + 60 * 60 * 1000);
    document.cookie = `username=${encodeURIComponent(username)}; expires=${date.toUTCString()}; path=/`;
  },

  getUsername() {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('username='))
      ?.split('=')[1];
  },

  clearSession() {
    document.cookie =
      'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },
};

export default CookieManager;
