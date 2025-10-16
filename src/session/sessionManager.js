import { SERVER_URL, profiles } from '../../config.js';

export const createAndUpdateSession = (req, data) => {
  createSession(req);
  updateSession(req, data);
}

export const createSession = (req) => {
  if (!req.session.data) {
    req.session.data = {};
  }
}

export const updateSession = (req, data) => {
  let userData = data || {};
  if (!req.session.data) {
    createSession(req);
  }
  req.session.data = { ...req.session.data, ...userData };
  return req.session.data;
}

export const destroySession = (req) => {
  req.session.destroy(err => {
    if (err) {
      return { errorCode: 500, message: 'Error al cerrar sesión' };
    }
  });
  return { message: 'Sesión cerrada correctamente' };
}

export const getSession = (req) => {
  return req.session.data || {};
}

export const existSession = (req) => {
  if (req.session.data && Object.keys(req.session.data).length > 0) {
    return true;
  } else {
    return false;
  }
}

export const setUserProfile = async (profile, id_user) => {
  await fetch(`${SERVER_URL}/profiles`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(async profiles => {
    const id_profile = profiles.find(p => p.name === profile)?._id;

    await fetch(`${SERVER_URL}/userProfile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_profile, id_user })
    });
  });
}

export const getIdUser = async (username) => {
  return await fetch(`${SERVER_URL}/users`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(users => {
    return users.find(u => u.username === username)?._id;
  });
}

// (() => {
//   setTimeout(async () => {
//     await getIdUser('Bustos')
//     .then(async id_user => {
//       await setUserProfile(profiles.EVENT_ADMIN.name, id_user)
//       .then(() => console.log('Profile set to user'))
//       .catch(err => console.log('Error setting profile to user', err));
//     })
//     .catch(err => console.log('Error getting user ID', err));
//   }, 5000);
// })();

export const findUsers = async (userData) => {
  const keys = Object.keys(userData);
  return await fetch(`${SERVER_URL}/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then(data => {
    return data?.filter(u => u && (
      keys.some(key => userData[key] && u[key] && u[key].includes(userData[key]))
    ));
  });
};