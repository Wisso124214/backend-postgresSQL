export const config = {
  PORT: process.env.PORT || 3050,
  SERVER_IP: 'localhost',
  PROTOCOL: 'http',
};

export const SERVER_URL = `${config.PROTOCOL}://${config.SERVER_IP}:${config.PORT}`;

export const PROFILES = {
  SUPER_ADMIN: {
    name: 'super administrador',
  },
  SECURITY_ADMIN: {
    name: 'administrador de seguridad',
  },
  EVENT_ADMIN: {
    name: 'administrador de eventos',
  },
  PARTICIPANT: {
    name: 'participante',
  },
};

export const ERROR_CODES = {
  BAD_REQUEST: 400, // El servidor no pudo entender la solicitud debido a una sintaxis inválida
  UNAUTHORIZED: 401, // La solicitud requiere autenticación del usuario
  FORBIDDEN: 403, // El servidor entendió la solicitud, pero se niega a autorizarla
  NOT_FOUND: 404, // El servidor no pudo encontrar el recurso solicitado
  REQUEST_TIMEOUT: 408, // El servidor agotó el tiempo de espera esperando la solicitud
  CONFLICT: 409, // La solicitud no se pudo completar debido a un conflicto con el estado actual del recurso. Por ejemplo, intentar registrar un usuario con un nombre de usuario o correo electrónico que ya existe
  INTERNAL_SERVER_ERROR: 500, // El servidor encontró una condición inesperada que le impidió completar la solicitud
};
