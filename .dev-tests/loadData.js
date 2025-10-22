import bcrypt from 'bcrypt';
import DBMS from '#dbms/dbms.js';
import { subsystems, menus } from '#dbms/db-structure.js';

const methods = [
  'getAllDinamicMethodNames',
  'getUsers',
  'getUsersWhere',
  'insertUser',
  'updateUserById',
  'updateUserByUsername',
  'deleteUserByUsername',
  'deleteUserById',
  'deleteAllUsers',
  'deleteUsersWhere',
  'getProfiles',
  'getProfilesWhere',
  'insertProfile',
  'updateProfileById',
  'updateProfileByUsername',
  'deleteProfileByUsername',
  'deleteProfileById',
  'deleteAllProfiles',
  'deleteProfilesWhere',
  'getSubsystems',
  'getSubsystemsWhere',
  'insertSubsystem',
  'updateSubsystemById',
  'updateSubsystemByUsername',
  'deleteSubsystemByUsername',
  'deleteSubsystemById',
  'deleteAllSubsystems',
  'deleteSubsystemsWhere',
  'getClasses',
  'getClassesWhere',
  'insertClass',
  'updateClassById',
  'updateClassByUsername',
  'deleteClassByUsername',
  'deleteClassById',
  'deleteAllClasses',
  'deleteClassesWhere',
  'getMethods',
  'getMethodsWhere',
  'insertMethod',
  'updateMethodById',
  'updateMethodByUsername',
  'deleteMethodByUsername',
  'deleteMethodById',
  'deleteAllMethods',
  'deleteMethodsWhere',
  'getMenus',
  'getMenusWhere',
  'insertMenu',
  'updateMenuById',
  'updateMenuByUsername',
  'deleteMenuByUsername',
  'deleteMenuById',
  'deleteAllMenus',
  'deleteMenusWhere',
  'getOptions',
  'getOptionsWhere',
  'insertOption',
  'updateOptionById',
  'updateOptionByUsername',
  'deleteOptionByUsername',
  'deleteOptionById',
  'deleteAllOptions',
  'deleteOptionsWhere',
  'getTransactions',
  'getTransactionsWhere',
  'insertTransaction',
  'updateTransactionById',
  'updateTransactionByUsername',
  'deleteTransactionByUsername',
  'deleteTransactionById',
  'deleteAllTransactions',
  'deleteTransactionsWhere',
  'getOptionProfiles',
  'getOptionProfilesWhere',
  'insertOptionProfile',
  'updateOptionProfileById',
  'updateOptionProfileByUsername',
  'deleteOptionProfileByUsername',
  'deleteOptionProfileById',
  'deleteAllOptionProfiles',
  'deleteOptionProfilesWhere',
  'getOptionMenus',
  'getOptionMenusWhere',
  'insertOptionMenu',
  'updateOptionMenuById',
  'updateOptionMenuByUsername',
  'deleteOptionMenuByUsername',
  'deleteOptionMenuById',
  'deleteAllOptionMenus',
  'deleteOptionMenusWhere',
  'getMethodProfiles',
  'getMethodProfilesWhere',
  'insertMethodProfile',
  'updateMethodProfileById',
  'updateMethodProfileByUsername',
  'deleteMethodProfileByUsername',
  'deleteMethodProfileById',
  'deleteAllMethodProfiles',
  'deleteMethodProfilesWhere',
];

export const loadData = async () => {
  const dbms = new DBMS();
  await dbms.init();

  /********************************************************************* */

  const testSqlQueryString = async (data) => {
    const { values, queryString } = data;

    try {
      const result = await dbms.query(queryString, values);
      if (result && result.rows && result.rows.length > 0) return result.rows;
      else return 'No se encontraron registros';
    } catch (err) {
      console.error('Error executing query:', err);
      throw err;
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
    await dbms
      .query(insertUserQuery, [
        username,
        hashedPassword,
        email,
        status,
        register_date,
      ])
      .catch((err) => {
        console.error(
          'Error registering user:',
          err.detail || err.message || err
        );
      });
  };

  // Llamadas

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

  const tableName = 'user';
  const data = {
    username: 'Bustos',
    email: 'luisdavidbustosnunez@gmail.com',
  };
  const keys = Object.keys(data);
  const values = Object.values(data);
  const queryString = `SELECT * FROM public.${tableName} WHERE ${keys.map((f, i) => `${f} = $${i + 1}`).join(' AND ')};`;

  // console.log(await testSqlQueryString({ values, queryString }));

  // dbms
  //   .getUsersWhere({
  //     whereData: {
  //       username: 'Bustos',
  //     },
  //   })
  //   .then((res) => {
  //     console.log('User found:', res.data ? res.data : 'No user found');
  //   });
  dbms
    .insertUser({
      whereData: {
        username: 'Bustos4',
        password: 'QWEqwe123·',
        email: 'luis4davidbustosnunez@gmail.com',
        status: 'active',
        register_date: new Date().toDateString(),
      },
    })
    .then((res) => {
      console.log(res);
    });
};

loadData();
