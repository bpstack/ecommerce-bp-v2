// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // The host sleeps when idle, so the daily cron (config/server.ts) may never
    // fire: purge on every start too. Not awaited, so it cannot delay startup.
    strapi
      .service('api::cart.cart')
      .purgeExpiredGuests()
      .catch((error) => strapi.log.error('Expired guest carts purge failed', error));
  },
};
