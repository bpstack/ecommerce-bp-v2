import type { Schema, Struct } from '@strapi/strapi';

export interface ProductsRating extends Struct.ComponentSchema {
  collectionName: 'components_products_ratings';
  info: {
    displayName: 'Rating';
  };
  attributes: {
    count: Schema.Attribute.Integer;
    stars: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'products.rating': ProductsRating;
    }
  }
}
