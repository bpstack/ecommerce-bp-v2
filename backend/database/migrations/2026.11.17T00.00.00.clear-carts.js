'use strict';

// One-off: carts are disposable and most were empty leftovers of the old
// cookie-only flow. Emptying them also lets `draftAndPublish` be turned off
// without carrying draft/published duplicates. Link tables cascade.
module.exports = {
  async up(knex) {
    for (const table of ['cart_items', 'carts']) {
      if (await knex.schema.hasTable(table)) await knex(table).del();
    }
  },
};
