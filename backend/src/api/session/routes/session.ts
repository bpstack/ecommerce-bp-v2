module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/session',
      handler: 'session.getSession',
      config: {
        auth: false,
      },
    },
  ],
};