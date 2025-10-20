export const config = {
  PORT: process.env.PORT || 3030,
  SERVER_IP: 'localhost',
  PROTOCOL: 'http',
};

export const SERVER_URL = `${config.PROTOCOL}://${config.SERVER_IP}:${config.PORT}`;

export const profiles = {
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
