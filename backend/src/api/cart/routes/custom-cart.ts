export default {
  routes: [
    {
      method: 'POST',
      path: '/carts/migrate',
      handler: 'custom-cart.migrate',
      config: {
        auth: false,
      },
    },
  ],
};