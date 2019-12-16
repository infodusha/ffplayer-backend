import {defaultFieldResolver} from '../modules/graphql.js';
import {SchemaDirectiveVisitor} from '../modules/apollo.js';
import {ApolloError} from '../services/error.js';

/**
 * Protects data by auth
 */
export class Auth extends SchemaDirectiveVisitor {
  /**
   * Can be applyed on object
   * @param {any} type
   */
  visitObject(type) {
    type._requiredAuth = this.args.required;
    this.ensureFieldsWrapped(type);
  }

  /**
   * Can be applyed on field
   * @param {any} field
   * @param {any} details
   */
  visitFieldDefinition(field, details) {
    field._requiredAuth = this.args.required;
    this.ensureFieldsWrapped(details.objectType);
  }

  /**
   * Protector
   * @param {any} objectType
   */
  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) {
      return;
    }
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const {resolve = defaultFieldResolver} = field;

      field.resolve = function(...args) {
        let required = null;
        if (field._requiredAuth != null) {
          required = field._requiredAuth;
        }
        if (objectType._requiredAuth != null) {
          required = objectType._requiredAuth;
        }

        if (required === null) {
          return resolve.apply(this, args);
        }

        const context = args[2];

        if (!context.user && required) {
          throw new ApolloError('Not autorized');
        }
        if (context.user && !required) {
          throw new ApolloError('Autorized');
        }

        return resolve.apply(this, args);
      };
    });
  }
}
