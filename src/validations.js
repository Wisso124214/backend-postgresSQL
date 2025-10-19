const validationValues = {
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

export const validateUsername = (value) => {
  // Chequear que la longitud sea mayor a 6 caracteres
  // Chequear que el username no exista en la lista de usernames

  if (
    value &&
    value.length < validationValues.user.username.min &&
    value.length > 0
  ) {
    return `El nombre de usuario debe tener al menos ${validationValues.user.username.min} caracteres.`;
  } else if (value && value.length > validationValues.user.username.max) {
    return `El nombre de usuario no puede tener más de ${validationValues.user.username.max} caracteres.`;
  }
  // if (listUsernames.includes(value)) {
  //   return 'El nombre de usuario ya está en uso.';
  // }

  return '';
};

export const validateEmail = (email) => {
  // Chequear que el email tenga un formato válido

  if (email && email.length > validationValues.user.email.max) {
    return `El email no puede tener más de ${validationValues.user.email.max} caracteres`;
  }

  const emailRegex = new RegExp(
    '[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}'
  );

  if (email && email.length > 0 && !emailRegex.test(email)) {
    return 'El email no es válido';
  }
  return '';
};

export const validatePassword = (text) => {
  // Chequear que la contraseña tenga al menos 8 caracteres
  // Chequear que la contraseña tenga al menos una mayúscula, una minúscula, un número y un carácter especial

  if (text && text.length > validationValues.user.password.max) {
    return `La contraseña no puede tener más de ${validationValues.user.password.max} caracteres`;
  }

  let errorText = '';
  const length = text.length > validationValues.user.password.min;
  const numberRegex = new RegExp('[0-9]');
  const uppercaseRegex = new RegExp('[A-Z]');
  const lowercaseRegex = new RegExp('[a-z]');
  const symbolRegex = /[-:+_º·$/[\]}{|~€|@#~€¬`«»%()?¿¡;.'"!@#\\$//%\\^,&\\*]/;

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
};

export const validateConfirmPassword = (pass, confirmPass) => {
  // Chequear que la contraseña de confirmación sea igual a la contraseña

  if (pass !== confirmPass) {
    return 'Las contraseñas no coinciden';
  }
  return '';
};

const getValidationValues = (entity, field) => {
  return validationValues[entity][field];
};

export const validateName = (value, entity) => {
  const { min, max } = getValidationValues(entity, 'name');

  if (value && value.length < min && value.length > 0) {
    return `El nombre de ${entity} debe tener al menos ${min} caracteres.`;
  } else if (value && value.length > max) {
    return `El nombre de ${entity} no puede tener más de ${max} caracteres.`;
  }
  return '';
};

export const validateDescription = (value, entity) => {
  const { max } = getValidationValues(entity, 'description');
  if (value && value.length > max) {
    return `La descripción de ${entity} no puede tener más de ${max} caracteres.`;
  }
  return '';
};
