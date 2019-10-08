const AttributeDefinitions = require('./AttributeDefinitions');
const Initialization = require('../initialization');
const StrictMode = require('../strictMode');
const { SCHEMA } = require('../symbols');

class Schema {
  static for({ attributeDefinitions, wrappedClass, options }) {
    const parentSchema = wrappedClass[SCHEMA];

    if (parentSchema) {
      return this.extend(parentSchema, {
        attributeDefinitions,
        wrappedClass,
        options,
      });
    }

    return new this({
      attributeDefinitions,
      wrappedClass,
      options,
    });
  }

  static extend(parentSchema, { attributeDefinitions, wrappedClass, options }) {
    const parentAttributes = parentSchema.attributeDefinitions.byKey();

    attributeDefinitions = {
      ...parentAttributes,
      ...attributeDefinitions,
    };

    options = {
      ...parentSchema.options,
      ...options,
      dynamics: {
        ...parentSchema.dynamics,
        ...options.dynamics,
      },
    };

    return new this({
      attributeDefinitions,
      wrappedClass,
      options,
    });
  }

  constructor({ attributeDefinitions, wrappedClass, options }) {
    this.attributeDefinitions = AttributeDefinitions.for(attributeDefinitions, { schema: this });
    this.wrappedClass = wrappedClass;
    this.options = options;

    this.initialization = Initialization.for(this);
    this.strictMode = StrictMode.for(this);
  }

  initializeInstance(instance, { attributes }) {
    return this.initialization.initialize(instance, { attributes });
  }

  dynamicTypeFor(typeIdentifier) {
    return this.options.dynamics[typeIdentifier];
  }
}

module.exports = Schema;
