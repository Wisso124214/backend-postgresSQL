import bcrypt from 'bcrypt';
import { dbClientQuery } from '#src/db.js';

export const loadData = async () => {
  // dbClientQuery('SELECT * FROM public."user"').then((res) => {
  //   console.log('rows:', JSON.stringify(res.rows, null, 2));
  // });

  const postProfiles = async (profiles) => {
    await dbClientQuery(`DELETE * FROM public."profile";`);
    const insertQuery = `
      INSERT INTO public."profile" (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING;
    `;
    for (const profile of profiles) {
      await dbClientQuery(insertQuery, [profile]);
    }
  };

  const printProfiles = async () => {
    const selectQuery = 'SELECT * FROM public."profile";';
    const res = await dbClientQuery(selectQuery);
    console.log('Profiles:', JSON.stringify(res.rows, null, 2));
  };

  const printAllUsers = async () => {
    const selectQuery = 'SELECT * FROM public."user";';
    const res = await dbClientQuery(selectQuery);
    console.log('Users:', JSON.stringify(res.rows, null, 2));
  };

  const printProfilesOfUsers = async () => {
    const selectQuery = `
      SELECT u.id AS user_id, u.username, p.id AS profile_id, p.name AS profile_name
      FROM public."user" u
      JOIN public."user_profile" up ON u.id = up.id_user
      JOIN public."profile" p ON up.id_profile = p.id;
    `;
    const res = await dbClientQuery(selectQuery);
    console.log('User Profiles:', JSON.stringify(res.rows, null, 2));
  };

  const assignProfileToUser = async (username, profileName) => {
    const userQuery = 'SELECT id FROM public."user" WHERE username = $1;';
    const profileQuery = 'SELECT id FROM public."profile" WHERE name = $1;';
    const insertUserProfileQuery = `
      INSERT INTO public."user_profile" (id_user, id_profile)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
    const userRes = await dbClientQuery(userQuery, [username]);
    const profileRes = await dbClientQuery(profileQuery, [profileName]);
    if (userRes.rows.length > 0 && profileRes.rows.length > 0) {
      const userId = userRes.rows[0].id;
      const profileId = profileRes.rows[0].id;
      await dbClientQuery(insertUserProfileQuery, [userId, profileId]);
    } else {
      console.error('User or Profile not found for assignment');
    }
  };

  const assignProfilesToUser = async (username, arrProfiles) => {
    for (const profile of arrProfiles) {
      await assignProfileToUser(username, profile);
    }
  };

  const assignProfilesToUsers = async (jsonProfiles) => {
    const users = Object.keys(jsonProfiles);
    for (const username of users) {
      await assignProfilesToUser(username, jsonProfiles[username]);
    }
  };

  const registerUser = async (data) => {
    const {
      username,
      password,
      email,
      status = 'active',
      register_date = new Date().toISOString(),
    } = data;

    if (!username || !password || !email) {
      console.error('Missing required user data');
      return;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertUserQuery = `
      INSERT INTO public."user" (username, password, email, status, register_date)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await dbClientQuery(insertUserQuery, [
      username,
      hashedPassword,
      email,
      status,
      register_date,
    ]).catch((err) => {
      console.error(
        'Error registering user:',
        err.detail || err.message || err
      );
    });
  };

  // Llamadas
  // const profiles = [
  //   'administrador de seguridad',
  //   'administrador de eventos',
  //   'participante',
  // ];
  // await postProfiles(profiles);
  // await printProfiles();

  // const users = [
  //   {
  //     username: 'Bustos',
  //     password: 'QWEqwe123·',
  //     email: 'luisdavidbustosnunez@gmail.com',
  //   },
  //   {
  //     username: 'Bustoss',
  //     password: 'QWEqwe123·',
  //     email: 'luissdavidbustosnunez@gmail.com',
  //   },
  // ];

  // for (const user of users) {
  //   await registerUser(user);
  // }

  // const jsonProfiles = {
  //   Bustos: ['administrador de seguridad', 'participante'],
  //   Bustoss: ['administrador de eventos'],
  // };
  // await assignProfilesToUsers(jsonProfiles);

  await printProfilesOfUsers();
  // await printAllUsers();
};

loadData();
