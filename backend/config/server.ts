export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),
  app: {
    keys: env.array('APP_KEYS'),
  },
  proxy: {
    koa: true,
  },
  cron: {
    enabled: true,
    tasks: {
      // Daily at 04:00
      '0 4 * * *': ({ strapi }) => strapi.service('api::cart.cart').purgeExpiredGuests(),
    },
  },
});