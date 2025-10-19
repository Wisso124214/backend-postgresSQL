import DB from '#src/db.js';

export default class Validator {
  constructor() {
    this.db = new DB();

    this.validationValues = {
      user: {
        username: { min: 6, max: 30 },
        email: { max: 100 },
        password: { min: 8, max: 80 },
      },
      profile: {
        name: { min: 3, max: 30 },
        description: { max: 300 },
      },
      subsystem: {
        name: { min: 3, max: 50 },
        description: { max: 300 },
      },
      class: {
        name: { min: 3, max: 30 },
        description: { max: 200 },
      },
      method: {
        name: { min: 3, max: 30 },
        description: { max: 200 },
      },
      menu: {
        name: { min: 3, max: 50 },
        description: { max: 200 },
      },
      transaction: {
        description: { max: 200 },
      },
    };
    if (!Validator.instance) {
      Validator.instance = this;
    }
    return Validator.instance;
  }

  validateUsername(value) {
    if (
      value &&
      value.length < this.validationValues.user.username.min &&
      value.length > 0
    ) {
      return `El nombre de usuario debe tener al menos ${this.validationValues.user.username.min} caracteres.`;
    } else if (
      value &&
      value.length > this.validationValues.user.username.max
    ) {
      return `El nombre de usuario no puede tener más de ${this.validationValues.user.username.max} caracteres.`;
    }

    let userExists = false;

    const usernameExistsQuery =
      'SELECT COUNT(*) FROM public."user" WHERE username = $1;';
    db.dbClientQuery(usernameExistsQuery, [value])
      .then((result) => {
        userExists = result.rows[0].count > 0;
      })
      .catch((err) => {
        console.error('Error checking username existence:', err);
      });

    if (userExists) {
      return 'El nombre de usuario ya está en uso.';
    }

    return '';
  }

  validateEmail(email) {
    // Chequear que el email tenga un formato válido

    if (email && email.length > this.validationValues.user.email.max) {
      return `El email no puede tener más de ${this.validationValues.user.email.max} caracteres`;
    }

    const emailRegex = new RegExp(
      '[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}'
    );

    if (email && email.length > 0 && !emailRegex.test(email)) {
      return 'El email no es válido';
    }

    let emailInUse = false;

    db.dbClientQuery('SELECT COUNT(*) FROM public."user" WHERE email = $1;', [
      email,
    ])
      .then((result) => {
        if (result.rows[0].count > 0) {
          emailInUse = true;
        }
      })
      .catch((err) => {
        console.error('Error checking email existence:', err);
      });

    if (emailInUse) {
      return 'El email ya está en uso.';
    }

    return '';
  }

  validatePassword(text) {
    // Chequear que la contraseña tenga al menos 8 caracteres
    // Chequear que la contraseña tenga al menos una mayúscula, una minúscula, un número y un carácter especial

    if (text && text.length > this.validationValues.user.password.max) {
      return `La contraseña no puede tener más de ${this.validationValues.user.password.max} caracteres`;
    }

    let errorText = '';
    const length = text.length > this.validationValues.user.password.min;
    const numberRegex = new RegExp('[0-9]');
    const uppercaseRegex = new RegExp('[A-Z]');
    const lowercaseRegex = new RegExp('[a-z]');
    const symbolRegex =
      /[-:+_º·$/[\]}{|~€|@#~€¬`«»%()?¿¡;.'"!@#\\$//%\\^,&\\*]/;

    if (text.length > 0) {
      if (!length) {
        errorText = 'La contraseña debe tener al menos 8 caracteres';
      } else if (!uppercaseRegex.test(text)) {
        errorText = 'La contraseña debe contener al menos una letra mayúscula';
      } else if (!lowercaseRegex.test(text)) {
        errorText = 'La contraseña debe contener al menos una letra minúscula';
      } else if (!numberRegex.test(text)) {
        errorText = 'La contraseña debe contener al menos un número';
      } else if (!symbolRegex.test(text)) {
        errorText = 'La contraseña debe contener al menos un símbolo';
      } else {
        errorText = '';
      }
    }
    return errorText;
  }

  validateConfirmPassword(pass, confirmPass) {
    // Chequear que la contraseña de confirmación sea igual a la contraseña

    if (pass !== confirmPass) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  getValidationValues(entity, field) {
    return this.validationValues[entity][field];
  }

  validateName(value, entity) {
    const { min, max } = this.getValidationValues(entity, 'name');

    if (value && value.length < min && value.length > 0) {
      return `El nombre de ${entity} debe tener al menos ${min} caracteres.`;
    } else if (value && value.length > max) {
      return `El nombre de ${entity} no puede tener más de ${max} caracteres.`;
    }
    return '';
  }

  validateDescription(value, entity) {
    const { max } = this.getValidationValues(entity, 'description');
    if (value && value.length > max) {
      return `La descripción de ${entity} no puede tener más de ${max} caracteres.`;
    }
    return '';
  }
}
