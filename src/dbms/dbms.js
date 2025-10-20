import { pool } from '#config/config-db.js';

export default class DBMS {
  constructor() {
    this.pool = pool;
    this.tableNames = [
      'user',
      'profile',
      'subsystem',
      'class',
      'method',
      'menu',
      'option',
      'transaction',
      'option_profile',
      'option_menu',
      'method_profile',
      'user_profile',
    ];

    if (!DBMS.instance) {
      DBMS.instance = this;
    }
    return DBMS.instance;
  }

  init() {
    this.createMaintenance();
  }

  async connection() {
    return await pool
      .connect()
      .then((cli) => cli)
      .catch((err) => {
        console.error('Client database connection error', err.stack || err);
        process.exit(1);
      });
  }

  disconnection(client) {
    if (!client) {
      console.error('No client provided for disconnection');
      return;
    }

    try {
      client.release();
    } catch (err) {
      console.error(
        'Error closing client database connection',
        err.stack || err
      );
    }
  }

  async poolDisconnection() {
    return await pool
      .end()
      .then(() => console.log('Database pool has ended'))
      .catch((err) => {
        console.error('Error ending database pool', err.stack || err);
      });
  }

  async query(query, params = []) {
    const client = await this.connection();
    try {
      return await client.query(query, params);
    } catch (error) {
      console.error('Error executing query', error.stack || error);
    } finally {
      this.disconnection(client);
    }
  }

  createMaintenance() {
    this.tableNames.forEach((tableName) => {
      this.createMaintenanceTableName(tableName);
    });
  }

  createMaintenanceTableName(tableName) {
    const functionTableName = tableName
      .split('_')
      .map(this.toUpperCaseFirstLetter)
      .join('');

    const pluralFunctionTableName = functionTableName.endsWith('s')
      ? `${functionTableName}es`
      : `${functionTableName}s`;

    this[`get${pluralFunctionTableName}`] = (req, res) => {
      this.query(`SELECT * FROM public.${tableName}`, [])
        .then((result) => {
          res.send(result.rows);
        })
        .catch((error) => {
          console.error(`Error fetching ${tableName}s:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`get${pluralFunctionTableName}Where`] = (req, res) => {
      const fields = Object.keys(req.params || req.body || {});
      const values = Object.values(req.params || req.body || {});

      const query = `SELECT * FROM public.${tableName} WHERE ${fields.map((f, i) => `${f} = $${i + 1}`).join(' AND ')};`;
      this.query(query, values)
        .then((result) => {
          res.send(result.rows);
        })
        .catch((error) => {
          console.error(`Error fetching ${tableName}s:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`insert${functionTableName}`] = (req, res) => {
      const keys = Object.keys(req.body || {});
      const values = Object.values(req.body || {});

      const insertQuery = `
        INSERT INTO public.${tableName} (${keys.join(', ')})
        VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')});
      `;

      this.query(insertQuery, values)
        .then(() => {
          res.send({ message: 'Registro insertado correctamente' });
        })
        .catch((error) => {
          console.error(`Error inserting into ${tableName}:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`update${functionTableName}ById`] = (req, res) => {
      const { id } = req.params || req.body;
      let keys = Object.keys(req.body || {});

      if (req.params && req.params.id) {
        keys = keys.filter((key) => key !== 'id');
      }

      if (!id) {
        return res.status(400).send({
          errorCode: 400,
          message: 'ID es requerido para la actualización',
        });
      }

      if (keys.length === 0) {
        return res.status(400).send({
          errorCode: 400,
          message: 'No se proporcionaron campos para actualizar',
        });
      }

      const updateQuery = `
      UPDATE public.${tableName}
      SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(', ')}
      WHERE id = $${keys.length + 1};
    `;
      this.query(updateQuery, [...Object.values(req.body), id])
        .then(() => {
          res.send({ message: 'Registro actualizado correctamente' });
        })
        .catch((error) => {
          console.error(`Error updating ${tableName}:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`update${functionTableName}ByUsername`] = (req, res) => {
      const { username } = req.params || req.body;
      let keys = Object.keys(req.body || {});

      if (req.params && req.params.username) {
        keys = keys.filter((key) => key !== 'username');
      }

      if (!username) {
        return res.status(400).send({
          errorCode: 400,
          message: 'Username es requerido para la actualización',
        });
      }

      if (keys.length === 0) {
        return res.status(400).send({
          errorCode: 400,
          message: 'No se proporcionaron campos para actualizar',
        });
      }

      const updateQuery = `
      UPDATE public.${tableName}
      SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(', ')}
      WHERE username = $${keys.length + 1};
    `;
      this.query(updateQuery, [...Object.values(req.body), username])
        .then(() => {
          res.send({ message: 'Registro actualizado correctamente' });
        })
        .catch((error) => {
          console.error(`Error updating ${tableName}:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`delete${functionTableName}ByUsername`] = (req, res) => {
      const { username } = req.params;
      const deleteQuery = `DELETE FROM public.${tableName} WHERE username = $1;`;
      this.query(deleteQuery, [username])
        .then(() => {
          res.send({ message: 'Registro eliminado correctamente' });
        })
        .catch((error) => {
          console.error(`Error eliminando ${tableName}:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`delete${functionTableName}ById`] = (req, res) => {
      const { id } = req.params;
      const deleteQuery = `DELETE FROM public.${tableName} WHERE id = $1;`;
      this.query(deleteQuery, [id])
        .then(() => {
          res.send({ message: 'Registro eliminado correctamente' });
        })
        .catch((error) => {
          console.error(`Error eliminando ${tableName}:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`deleteAll${pluralFunctionTableName}`] = (req, res) => {
      if (
        !req.body.confirm ||
        req.body.confirm !== `DELETE_ALL_${tableName.toUpperCase()}S`
      ) {
        return res.status(400).send({
          errorCode: 400,
          message: `Confirmación no válida para eliminar todos los ${tableName}`,
        });
      }

      const deleteQuery = `DELETE FROM public.${tableName};`;
      this.query(deleteQuery, [])
        .then(() => {
          res.send({
            message: `Todos los ${tableName} han sido eliminados correctamente`,
          });
        })
        .catch((error) => {
          console.error(`Error eliminando ${tableName}:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };

    this[`delete${pluralFunctionTableName}Where`] = (req, res) => {
      const { fields, values } = req.params;

      const query = `DELETE FROM public.${tableName} WHERE ${fields.map((f, i) => `${f} = $${i + 1}`).join(' AND ')};`;
      this.query(query, values)
        .then(() => {
          res.send({ message: `${tableName} eliminados correctamente` });
        })
        .catch((error) => {
          console.error(`Error eliminando ${tableName}:`, error);
          res
            .status(500)
            .send({ errorCode: 500, message: 'Error del servidor' });
        });
    };
  }

  toUpperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getAllDinamicMethodNames = () =>
    Object.keys(this).filter((method) => typeof this[method] === 'function');

  async setUserProfile(data) {
    const { username, profile } = data;
    if (!username || !profile) throw new Error('Invalid or missing data');
    const userQuery = 'SELECT id FROM public."user" WHERE username = $1;';
    const profileQuery = 'SELECT id FROM public."profile" WHERE name = $1;';
    const insertUserProfileQuery = `
        INSERT INTO public."user_profile" (id_user, id_profile)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `;
    const userRes = await this.query(userQuery, [username]);
    const profileRes = await this.query(profileQuery, [profile]);
    if (userRes.rows.length > 0 && profileRes.rows.length > 0) {
      const userId = userRes.rows[0].id;
      const profileId = profileRes.rows[0].id;
      await this.query(insertUserProfileQuery, [userId, profileId]);
    } else {
      console.error('User or Profile not found for assignment');
    }
  }

  async setUsersProfiles(data) {
    const users = Object.keys(data);
    for (const username of users) {
      const arrProfiles = data[username];
      for (const profile of arrProfiles) {
        await this.setUserProfile({ username, profile });
      }
    }
  }

  async getUserProfiles(data) {
    const { username } = data;
    if (!username) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT u.id AS user_id, u.username, p.id AS profile_id, p.name AS profile_name
      FROM public."user" u
      JOIN public."user_profile" up ON u.id = up.id_user
      JOIN public."profile" p ON up.id_profile = p.id
      WHERE u.username = $1;
    `;
    try {
      const res = await this.query(selectQuery, [username]);
      return res.rows;
    } catch (error) {
      console.error('Error in getUserProfiles:', error);
      throw new Error('Database error');
    }
  }

  async getUsersProfiles() {
    const selectQuery = `
      SELECT u.id AS user_id, u.username, p.id AS profile_id, p.name AS profile_name
      FROM public."user" u
      JOIN public."user_profile" up ON u.id = up.id_user
      JOIN public."profile" p ON up.id_profile = p.id
    `;
    try {
      const res = await this.query(selectQuery);
      return res.rows;
    } catch (error) {
      console.error('Error in getUsersProfiles:', error);
      throw new Error('Database error');
    }
  }

  async setProfileOption(data) {
    const { option, profile } = data;
    if (!option || !profile) throw new Error('Invalid or missing data');
    const optionQuery = 'SELECT id FROM public."option" WHERE name = $1;';
    const profileQuery = 'SELECT id FROM public."profile" WHERE name = $1;';
    const insertOptionProfileQuery = `
        INSERT INTO public."option_profile" (id_option, id_profile)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `;
    try {
      const optionRes = await this.query(optionQuery, [option]);
      const profileRes = await this.query(profileQuery, [profile]);
      if (optionRes.rows.length > 0 && profileRes.rows.length > 0) {
        const optionId = optionRes.rows[0].id;
        const profileId = profileRes.rows[0].id;
        await this.query(insertOptionProfileQuery, [optionId, profileId]);
      } else {
        console.error('Option or Profile not found for assignment');
      }
    } catch (error) {
      console.error('Error in setProfileOption:', error);
      throw new Error('Database error');
    }
  }

  async setProfilesOptions(data) {
    const profiles = Object.keys(data);
    for (const profile of profiles) {
      const arrOptions = data[profile];
      for (const option of arrOptions) {
        await this.setProfileOption({ option, profile });
      }
    }
  }

  async getProfileOptions(data) {
    const { profile } = data;
    if (!profile) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT p.id AS profile_id, p.name AS profile_name, o.id AS option_id, o.name AS option_name
      FROM public."profile" p
      JOIN public."option_profile" op ON p.id = op.id_profile
      JOIN public."option" o ON op.id_option = o.id
      WHERE p.name = $1;
    `;
    try {
      const res = await this.query(selectQuery, [profile]);
      return res.rows;
    } catch (error) {
      console.error('Error in getProfileOptions:', error);
      throw new Error('Database error');
    }
  }

  async getProfilesOptions() {
    const selectQuery = `
      SELECT p.id AS profile_id, p.name AS profile_name, o.id AS option_id, o.name AS option_name
      FROM public."profile" p
      JOIN public."option_profile" op ON p.id = op.id_profile
      JOIN public."option" o ON op.id_option = o.id
    `;
    try {
      const res = await this.query(selectQuery);
      return res.rows;
    } catch (error) {
      console.error('Error in getProfilesOptions:', error);
      throw new Error('Database error');
    }
  }

  async delProfileOption(data) {
    const { option, profile } = data;
    if (!option || !profile) throw new Error('Invalid or missing data');
    const deleteQuery = `
      DELETE FROM public."option_profile"
      WHERE id_option = (SELECT id FROM public."option" WHERE name = $1)
      AND id_profile = (SELECT id FROM public."profile" WHERE name = $2);
    `;
    try {
      await this.query(deleteQuery, [option, profile]);
    } catch (error) {
      console.error('Error in delProfileOption:', error);
      throw new Error('Database error');
    }
  }

  async delProfilesOptions(data) {
    const profiles = Object.keys(data);
    for (const profile of profiles) {
      const arrOptions = data[profile];
      for (const option of arrOptions) {
        await this.delProfileOption({ option, profile });
      }
    }
  }

  async setMenuOption(data) {
    const { option, menu } = data;
    if (!option || !menu) throw new Error('Invalid or missing data');
    const optionQuery = 'SELECT id FROM public."option" WHERE name = $1;';
    const menuQuery = 'SELECT id FROM public."menu" WHERE name = $1;';
    const insertOptionMenuQuery = `
        INSERT INTO public."option_menu" (id_option, id_menu)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `;
    try {
      const optionRes = await this.query(optionQuery, [option]);
      const menuRes = await this.query(menuQuery, [menu]);
      if (optionRes.rows.length > 0 && menuRes.rows.length > 0) {
        const optionId = optionRes.rows[0].id;
        const menuId = menuRes.rows[0].id;
        await this.query(insertOptionMenuQuery, [optionId, menuId]);
      } else {
        console.error('Option or Menu not found for assignment');
      }
    } catch (error) {
      console.error('Error in setMenuOption:', error);
      throw new Error('Database error');
    }
  }

  async setMenusOptions(data) {
    const menus = Object.keys(data);
    for (const menu of menus) {
      const arrOptions = data[menu];
      for (const option of arrOptions) {
        await this.setMenuOption({ option, menu });
      }
    }
  }

  async getMenuOptions(data) {
    const { menu } = data;
    if (!menu) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT m.id AS menu_id, m.name AS menu_name, o.id AS option_id, o.name AS option_name
      FROM public."menu" m
      JOIN public."option_menu" om ON m.id = om.id_menu
      JOIN public."option" o ON om.id_option = o.id
      WHERE m.name = $1;
    `;
    try {
      const res = await this.query(selectQuery, [menu]);
      return res.rows;
    } catch (error) {
      console.error('Error in getMenuOptions:', error);
      throw new Error('Database error');
    }
  }

  async getMenusOptions() {
    const selectQuery = `
      SELECT m.id AS menu_id, m.name AS menu_name, o.id AS option_id, o.name AS option_name
      FROM public."menu" m
      JOIN public."option_menu" om ON m.id = om.id_menu
      JOIN public."option" o ON om.id_option = o.id
    `;
    try {
      const res = await this.query(selectQuery);
      return res.rows;
    } catch (error) {
      console.error('Error in getMenusOptions:', error);
      throw new Error('Database error');
    }
  }

  async delMenuOption(data) {
    const { option, menu } = data;
    if (!option || !menu) throw new Error('Invalid or missing data');
    const deleteQuery = `
      DELETE FROM public."option_menu"
      WHERE id_option = (SELECT id FROM public."option" WHERE name = $1)
      AND id_menu = (SELECT id FROM public."menu" WHERE name = $2);
    `;
    try {
      await this.query(deleteQuery, [option, menu]);
    } catch (error) {
      console.error('Error in delMenuOption:', error);
      throw new Error('Database error');
    }
  }

  async delMenusOptions(data) {
    const menus = Object.keys(data);
    for (const menu of menus) {
      const arrOptions = data[menu];
      for (const option of arrOptions) {
        await this.delMenuOption({ option, menu });
      }
    }
  }

  async setMenuOptionProfile(data) {
    const { menu, option, profile } = data;
    if (!menu || !option || !profile)
      throw new Error('Invalid or missing data');
    await this.setMenuOption({ option, menu });
    await this.setProfileOption({ option, profile });
  }

  async setMenusOptionsProfiles(data) {
    const profiles = Object.keys(data);
    for (const profile of profiles) {
      const menus = Object.keys(data[profile]);
      for (const menu of menus) {
        const arrOptions = data[profile][menu];
        for (const option of arrOptions) {
          await this.setMenuOptionProfile({ option, menu, profile });
        }
      }
    }
  }

  async getMenuOptionsProfile(data) {
    const { menu, profile } = data;
    if (!menu || !profile) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT m.id AS menu_id, m.name AS menu_name, o.id AS option_id, o.name AS option_name, p.id AS profile_id, p.name AS profile_name
      FROM public."menu" m
      JOIN public."option_menu" om ON m.id = om.id_menu
      JOIN public."option" o ON om.id_option = o.id
      JOIN public."option_profile" op ON o.id = op.id_option
      JOIN public."profile" p ON op.id_profile = p.id
      WHERE m.name = $1 AND p.name = $2;
    `;
    try {
      const res = await this.query(selectQuery, [menu, profile]);
      return res.rows;
    } catch (error) {
      console.error('Error in getMenuOptionsProfile:', error);
      throw new Error('Database error');
    }
  }

  async getMenusOptionsProfile(data) {
    const { profile } = data;
    if (!profile) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT m.id AS menu_id, m.name AS menu_name, o.id AS option_id, o.name AS option_name, p.id AS profile_id, p.name AS profile_name
      FROM public."menu" m
      JOIN public."option_menu" om ON m.id = om.id_menu
      JOIN public."option" o ON om.id_option = o.id
      JOIN public."option_profile" op ON o.id = op.id_option
      JOIN public."profile" p ON op.id_profile = p.id
      WHERE p.name = $1;
    `;
    try {
      const res = await this.query(selectQuery, [profile]);
      return res.rows;
    } catch (error) {
      console.error('Error in getMenusOptionsProfile:', error);
      throw new Error('Database error');
    }
  }

  async getMenusOptionsProfiles() {
    const selectQuery = `
      SELECT m.id AS menu_id, m.name AS menu_name, o.id AS option_id, o.name AS option_name, p.id AS profile_id, p.name AS profile_name
      FROM public."menu" m
      JOIN public."option_menu" om ON m.id = om.id_menu
      JOIN public."option" o ON om.id_option = o.id
      JOIN public."option_profile" op ON o.id = op.id_option
      JOIN public."profile" p ON op.id_profile = p.id
    `;
    try {
      const res = await this.query(selectQuery);
      return res.rows;
    } catch (error) {
      console.error('Error in getMenusOptionsProfile:', error);
      throw new Error('Database error');
    }
  }

  async delMenuOptionProfile(data) {
    const { menu, option, profile } = data;
    if (!menu || !option || !profile)
      throw new Error('Invalid or missing data');
    await this.delMenuOption({ option, menu });
    await this.delProfileOption({ option, profile });
  }

  async delMenuOptionsProfile(data) {
    const { profile, menu, arrOptions } = data;
    if (!profile || !menu || !arrOptions)
      throw new Error('Invalid or missing data');
    for (const option of arrOptions) {
      await this.delMenuOptionProfile({ option, menu, profile });
    }
  }

  async delMenusOptionsProfiles(data) {
    const profiles = Object.keys(data);
    for (const profile of profiles) {
      const menus = Object.keys(data[profile]);
      for (const menu of menus) {
        await this.delMenuOptionsProfile({
          profile,
          menu,
          arrOptions: data[profile][menu],
        });
      }
    }
  }

  async delAllMenusOptionsProfiles() {
    const deleteQuery = `
      DELETE FROM public."option_menu";
      DELETE FROM public."option_profile";
      DELETE FROM public."menu";
      DELETE FROM public."option";
    `;
    try {
      await this.query(deleteQuery);
    } catch (error) {
      console.error('Error in delAllMenusOptionsProfiles:', error);
      throw new Error('Database error');
    }
  }

  async replaceMenuOptionProfile(data) {
    const { menu, option, profile } = data;
    if (!menu || !option || !profile)
      throw new Error('Invalid or missing data');
    await this.delAllMenusOptionsProfiles();
    await this.setMenuOptionProfile({ option, menu, profile });
  }

  async replaceMenusOptionsProfiles(data) {
    await this.delAllMenusOptionsProfiles();
    await this.setMenusOptionsProfiles(data);
  }

  async setProfileMethod(data) {
    const { method, profile } = data;
    if (!method || !profile) throw new Error('Invalid or missing data');
    const methodQuery = 'SELECT id FROM public."method" WHERE name = $1;';
    const profileQuery = 'SELECT id FROM public."profile" WHERE name = $1;';
    const insertMethodProfileQuery = `
        INSERT INTO public."method_profile" (id_method, id_profile)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `;
    try {
      const methodRes = await this.query(methodQuery, [method]);
      const profileRes = await this.query(profileQuery, [profile]);
      if (methodRes.rows.length > 0 && profileRes.rows.length > 0) {
        const methodId = methodRes.rows[0].id;
        const profileId = profileRes.rows[0].id;
        await this.query(insertMethodProfileQuery, [methodId, profileId]);
      }
    } catch (error) {
      console.error('Error in setProfileMethod:', error);
      throw new Error('Database error');
    }
  }

  async setProfilesMethods(data) {
    const profiles = Object.keys(data);
    for (const profile of profiles) {
      const arrMethods = data[profile];
      for (const method of arrMethods) {
        await this.setProfileMethod({ method, profile });
      }
    }
  }

  async getProfileMethods(data) {
    const { profile } = data;
    if (!profile) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT p.id AS profile_id, p.name AS profile_name, m.id AS method_id, m.name AS method_name
      FROM public."profile" p
      JOIN public."method_profile" mp ON p.id = mp.id_profile
      JOIN public."method" m ON mp.id_method = m.id
      WHERE p.name = $1;
    `;
    try {
      const res = await this.query(selectQuery, [profile]);
      return res.rows;
    } catch (error) {
      console.error('Error in getProfileMethods:', error);
      throw new Error('Database error');
    }
  }

  async getProfilesMethods() {
    const selectQuery = `
      SELECT p.id AS profile_id, p.name AS profile_name, m.id AS method_id, m.name AS method_name
      FROM public."profile" p
      JOIN public."method_profile" mp ON p.id = mp.id_profile
      JOIN public."method" m ON mp.id_method = m.id
    `;
    try {
      const res = await this.query(selectQuery);
      return res.rows;
    } catch (error) {
      console.error('Error in getProfilesMethods:', error);
      throw new Error('Database error');
    }
  }

  async delProfileMethod(data) {
    const { method, profile } = data;
    if (!method || !profile) throw new Error('Invalid or missing data');
    const deleteQuery = `
      DELETE FROM public."method_profile"
      WHERE id_method = (SELECT id FROM public."method" WHERE name = $1)
      AND id_profile = (SELECT id FROM public."profile" WHERE name = $2);
    `;
    try {
      await this.query(deleteQuery, [method, profile]);
    } catch (error) {
      console.error('Error in delProfileMethod:', error);
      throw new Error('Database error');
    }
  }

  async delProfilesMethods(data) {
    const profiles = Object.keys(data);
    for (const profile of profiles) {
      const arrMethods = data[profile];
      for (const method of arrMethods) {
        await this.delProfileMethod({ method, profile });
      }
    }
  }

  async setClassMethod(data) {
    const { className, method } = data;
    if (!className || !method) throw new Error('Invalid or missing data');
    const classQuery = 'SELECT id FROM public."class" WHERE name = $1;';
    const methodQuery = 'SELECT id FROM public."method" WHERE name = $1;';
    const insertClassMethodQuery = `
        INSERT INTO public."class_method" (id_class, id_method)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `;
    try {
      const classRes = await this.query(classQuery, [className]);
      const methodRes = await this.query(methodQuery, [method]);
      if (classRes.rows.length > 0 && methodRes.rows.length > 0) {
        const classId = classRes.rows[0].id;
        const methodId = methodRes.rows[0].id;
        await this.query(insertClassMethodQuery, [classId, methodId]);
      }
    } catch (error) {
      console.error('Error in setClassMethod:', error);
      throw new Error('Database error');
    }
  }

  async setClassesMethods(data) {
    const classes = Object.keys(data);
    for (const className of classes) {
      const arrMethods = data[className];
      for (const method of arrMethods) {
        await this.setClassMethod({ className, method });
      }
    }
  }

  async getClassMethods(data) {
    const { className } = data;
    if (!className) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT c.id AS class_id, c.name AS class_name, m.id AS method_id, m.name AS method_name
      FROM public."class" c
      JOIN public."class_method" cm ON c.id = cm.id_class
      JOIN public."method" m ON cm.id_method = m.id
      WHERE c.name = $1;
    `;
    try {
      const res = await this.query(selectQuery, [className]);
      return res.rows;
    } catch (error) {
      console.error('Error in getClassMethods:', error);
      throw new Error('Database error');
    }
  }

  async getClassesMethods() {
    const selectQuery = `
      SELECT c.id AS class_id, c.name AS class_name, m.id AS method_id, m.name AS method_name
      FROM public."class" c
      JOIN public."class_method" cm ON c.id = cm.id_class
      JOIN public."method" m ON cm.id_method = m.id
    `;
    try {
      const res = await this.query(selectQuery);
      return res.rows;
    } catch (error) {
      console.error('Error in getClassesMethods:', error);
      throw new Error('Database error');
    }
  }

  async delClassMethod(data) {
    const { className, method } = data;
    if (!className || !method) throw new Error('Invalid or missing data');
    const deleteQuery = `
      DELETE FROM public."class_method"
      WHERE id_class = (SELECT id FROM public."class" WHERE name = $1)
      AND id_method = (SELECT id FROM public."method" WHERE name = $2);
    `;
    try {
      await this.query(deleteQuery, [className, method]);
    } catch (error) {
      console.error('Error in delClassMethod:', error);
      throw new Error('Database error');
    }
  }

  async delClassesMethods(data) {
    const classes = Object.keys(data);
    for (const className of classes) {
      const arrMethods = data[className];
      for (const method of arrMethods) {
        await this.delClassMethod({ className, method });
      }
    }
  }

  async setSubsystemClassMethod(data) {
    const { subsystem, className, method } = data;
    if (!subsystem || !className || !method)
      throw new Error('Invalid or missing data');
    await this.setClassMethod({ className, method });
    const classQuery = 'SELECT id FROM public."class" WHERE name = $1;';
    const subsystemQuery = 'SELECT id FROM public."subsystem" WHERE name = $1;';
    const insertSubsystemClassQuery = `
        INSERT INTO public."subsystem_class" (id_subsystem, id_class)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    try {
      const classRes = await this.query(classQuery, [className]);
      const subsystemRes = await this.query(subsystemQuery, [subsystem]);
      if (classRes.rows.length > 0 && subsystemRes.rows.length > 0) {
        const classId = classRes.rows[0].id;
        const subsystemId = subsystemRes.rows[0].id;
        await this.query(insertSubsystemClassQuery, [subsystemId, classId]);
      }
    } catch (error) {
      console.error('Error in setSubsystemClassMethod:', error);
      throw new Error('Database error');
    }
  }

  async setSubsystemsClassesMethods(data) {
    const subsystems = Object.keys(data);
    for (const subsystem of subsystems) {
      const classesMethods = data[subsystem];
      for (const className in classesMethods) {
        const methods = classesMethods[className];
        for (const method of methods) {
          await this.setSubsystemClassMethod({ subsystem, className, method });
        }
      }
    }
  }

  async getSubsystemClassesMethods(data) {
    const { subsystem } = data;
    if (!subsystem) throw new Error('Invalid or missing data');
    const selectQuery = `
      SELECT s.id AS subsystem_id, s.name AS subsystem_name,
             c.id AS class_id, c.name AS class_name,
             m.id AS method_id, m.name AS method_name
      FROM public."subsystem" s
      JOIN public."subsystem_class" sc ON s.id = sc.id_subsystem
      JOIN public."class" c ON sc.id_class = c.id
      JOIN public."class_method" cm ON c.id = cm.id_class
      JOIN public."method" m ON cm.id_method = m.id
      WHERE s.name = $1;
    `;
    try {
      const res = await this.query(selectQuery, [subsystem]);
      return res.rows;
    } catch (error) {
      console.error('Error in getSubsystemClassesMethods:', error);
      throw new Error('Database error');
    }
  }

  async getSubsystemsClassesMethods() {
    const selectQuery = `
      SELECT s.id AS subsystem_id, s.name AS subsystem_name,
             c.id AS class_id, c.name AS class_name,
             m.id AS method_id, m.name AS method_name
      FROM public."subsystem" s
      JOIN public."subsystem_class" sc ON s.id = sc.id_subsystem
      JOIN public."class" c ON sc.id_class = c.id
      JOIN public."class_method" cm ON c.id = cm.id_class
      JOIN public."method" m ON cm.id_method = m.id;
    `;
    try {
      const res = await this.query(selectQuery);
      return res.rows;
    } catch (error) {
      console.error('Error in getSubsystemsClassesMethods:', error);
      throw new Error('Database error');
    }
  }

  async delSubsystemClassMethod(data) {
    const { subsystem, className, method } = data;
    if (!subsystem || !className || !method)
      throw new Error('Invalid or missing data');
    await this.delClassMethod({ className, method });
    const deleteQuery = `
      DELETE FROM public."subsystem_class"
      WHERE id_subsystem = (SELECT id FROM public."subsystem" WHERE name = $1)
      AND id_class = (SELECT id FROM public."class" WHERE name = $2);
    `;
    try {
      await this.query(deleteQuery, [subsystem, className]);
    } catch (error) {
      console.error('Error in delSubsystemClassMethod:', error);
      throw new Error('Database error');
    }
  }

  async delSubsystemsClassesMethods(data) {
    const subsystems = Object.keys(data);
    for (const subsystem of subsystems) {
      const classesMethods = data[subsystem];
      for (const className in classesMethods) {
        const methods = classesMethods[className];
        for (const method of methods) {
          await this.delSubsystemClassMethod({ subsystem, className, method });
        }
      }
    }
  }

  async delAllSubsystemsClassesMethods() {
    const deleteQuery = `
      DELETE FROM public."method_profile";
      DELETE FROM public.transaction;
      DELETE FROM public."subsystem";
      DELETE FROM public."class";
      DELETE FROM public."method";
    `;
    try {
      await this.query(deleteQuery);
    } catch (error) {
      console.error('Error in delAllSubsystemsClassesMethods:', error);
      throw new Error('Database error');
    }
  }

  async replaceSubsystemClassMethod(data) {
    const { subsystem, className, method } = data;
    if (!subsystem || !className || !method)
      throw new Error('Invalid or missing data');
    await this.delSubsystemClassMethod({ subsystem, className, method });
    await this.setSubsystemClassMethod({ subsystem, className, method });
  }

  async replaceSubsystemsClassesMethods(data) {
    const subsystems = Object.keys(data);
    for (const subsystem of subsystems) {
      const classesMethods = data[subsystem];
      for (const className in classesMethods) {
        const methods = classesMethods[className];
        for (const method of methods) {
          await this.replaceSubsystemClassMethod({
            subsystem,
            className,
            method,
          });
        }
      }
    }
  }
}
