export const config = {
  DB_URL: 'mongodb+srv://backend:skeZ9tEqdLJ09Op3@cluster0.o7x9c.mongodb.net/db-web-2?retryWrites=true&w=majority&appName=Cluster0',
  PORT: process.env.PORT || 3030,
  SERVER_IP: 'localhost',
  PROTOCOL: 'http',
}

export const SERVER_URL = `${config.PROTOCOL}://${config.SERVER_IP}:${config.PORT}`;

export const profiles = {
  SECURITY_ADMIN: {
    name: 'administrador de seguridad'
  },
  EVENT_ADMIN: {
    name: 'administrador de eventos'
  },
  PARTICIPANT: {
    name: 'participante'
  }
}