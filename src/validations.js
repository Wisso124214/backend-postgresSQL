export const validateUsername = (value) => {
  // Chequear que la longitud sea mayor a 6 caracteres
  // Chequear que el username no exista en la lista de usernames

  if (value && value.length < 6 && value.length > 0) {
    return 'El nombre de usuario debe tener al menos 6 caracteres.';
  }
  // if (listUsernames.includes(value)) {
  //   return 'El nombre de usuario ya está en uso.';
  // }

  return '';
}

export const validateEmail = (email) => {
  // Chequear que el email tenga un formato válido

  const emailRegex = new RegExp('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}');

  if (email && email.length > 0 && !emailRegex.test(email)) {
    return 'El email no es válido';
  }
  return '';
}

export const validatePassword = (text) => {
  // Chequear que la contraseña tenga al menos 8 caracteres
  // Chequear que la contraseña tenga al menos una mayúscula, una minúscula, un número y un carácter especial

  let errorText = '';
  const length = text.length > 8;
  const numberRegex = new RegExp('[0-9]');
  const uppercaseRegex = new RegExp('[A-Z]');
  const lowercaseRegex = new RegExp('[a-z]');
  const symbolRegex = /[-:+_º·$/[\]}{|~€|@#~€¬`«»%()?¿¡;.'"!@#\\$//%\\^,&\\*]/;

  //Regex to number (rtn)
  const rtn = (regex) => regex.test(text) ? 1 : 0;

  const safety = rtn(symbolRegex) + rtn(lowercaseRegex) + rtn(uppercaseRegex) + rtn(numberRegex) + length;
  // safety <= 3 ? setPasswordState('low') : safety < 5 ? setPasswordState('medium') : setPasswordState('high');

  if (text.length > 0) {
    if (text.length < 8) {
      errorText = 'La contraseña debe tener al menos 8 caracteres'
    } else if (!uppercaseRegex.test(text)) {
      errorText = 'La contraseña debe contener al menos una letra mayúscula'
    } else if (!lowercaseRegex.test(text)) {
      errorText = 'La contraseña debe contener al menos una letra minúscula'
    } else if (!numberRegex.test(text)) {
      errorText = 'La contraseña debe contener al menos un número'
    } else if (!symbolRegex.test(text)) {
      errorText = 'La contraseña debe contener al menos un símbolo'
    } else {
      errorText = '';
    }
  }
  return errorText;
}

export const validateConfirmPassword = (pass, confirmPass) => {
  // Chequear que la contraseña de confirmación sea igual a la contraseña

  if (pass !== confirmPass) {
    return 'Las contraseñas no coinciden';
  }
  return '';
}