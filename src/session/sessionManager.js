import { SERVER_URL, profiles } from '#root/config.js';
import { dbClientQuery } from '#src/db.js';

export const createAndUpdateSession = (req, data) => {
  createSession(req);
  updateSession(req, data);
};

export const createSession = (req) => {
  if (!req.session.data) {
    req.session.data = {};
  }
};

export const updateSession = (req, data) => {
  let userData = data || {};
  if (!req.session.data) {
    createSession(req);
  }
  req.session.data = { ...req.session.data, ...userData };
  return req.session.data;
};

export const destroySession = (req) => {
  req.session.destroy((err) => {
    if (err) {
      return { errorCode: 500, message: 'Error al cerrar sesión' };
    }
  });
  return { message: 'Sesión cerrada correctamente' };
};

export const getSession = (req) => {
  return req.session.data || {};
};

export const existSession = (req) => {
  if (req.session.data && Object.keys(req.session.data).length > 0) {
    return true;
  } else {
    return false;
  }
};

export const setProfileToUser = async (data) => {
  const { username, profile } = data;
  const userQuery = 'SELECT id FROM public."user" WHERE username = $1;';
  const profileQuery = 'SELECT id FROM public."profile" WHERE name = $1;';
  const insertUserProfileQuery = `
      INSERT INTO public."user_profile" (id_user, id_profile)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
  const userRes = await dbClientQuery(userQuery, [username]);
  const profileRes = await dbClientQuery(profileQuery, [profile]);
  if (userRes.rows.length > 0 && profileRes.rows.length > 0) {
    const userId = userRes.rows[0].id;
    const profileId = profileRes.rows[0].id;
    await dbClientQuery(insertUserProfileQuery, [userId, profileId]);
  } else {
    console.error('User or Profile not found for assignment');
  }
};

export const setProfilesToUser = async (data) => {
  const { username, arrProfiles } = data;
  for (const profile of arrProfiles) {
    await setProfileToUser({ username, profile });
  }
};

export const setProfilesToUsers = async (jsonProfiles) => {
  const users = Object.keys(jsonProfiles);
  for (const username of users) {
    await setProfilesToUser({ username, arrProfiles: jsonProfiles[username] });
  }
};

export const findUsers = async (userData) => {
  const keys = Object.keys(userData);
  return await fetch(`${SERVER_URL}/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .then((data) => {
      return data?.filter(
        (u) =>
          u &&
          keys.some(
            (key) => userData[key] && u[key] && u[key].includes(userData[key])
          )
      );
    });
};
