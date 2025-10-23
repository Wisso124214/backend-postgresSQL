import bcrypt from 'bcrypt';
import DBMS from '#dbms/dbms.js';
import { subsystems, menus } from '#dbms/db-structure.js';
import Debugger from '#debugger/debugger.js';
import Services from '#services/services.js';
import { PROFILES } from '#root/config/config.js';

const methods = [
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
  'getUserProfiles',
  'getUserProfilesWhere',
  'insertUserProfile',
  'updateUserProfileById',
  'updateUserProfileByUsername',
  'deleteUserProfileByUsername',
  'deleteUserProfileById',
  'deleteAllUserProfiles',
  'deleteUserProfilesWhere',
];

export const trailMethods = async () => {
  const dbms = new DBMS();
  const dbger = new Debugger();
  const srvcs = new Services();
  dbms.init();

  // dbger.logData(srvcs.getAllDinamicMethodNames(dbms));

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

  // await dbms
  //   .getUsersWhere({
  //     whereData: {
  //       username: 'Bustos1',
  //     },
  //   })
  //   .then((res) => {
  //     console.log(res);
  //   });

  // console.log('--- INSERT USER ---');
  // dbms
  //   .insertUser({
  //     keyValueData: {
  //       username: 'Bustos1',
  //       password: 'QWEqwe123·',
  //       email: 'luis1davidbustosnunez@gmail.com',
  //       status: 'active',
  //       register_date: new Date().toDateString(),
  //     },
  //   })
  //   .then((res) => {
  //     console.log(res);
  //   });

  // console.log('--- SELECT PROFILE ---');
  // await dbms
  //   .query('SELECT * FROM public.profile WHERE name = $1;', ['guest'])
  //   .then((res) => {
  //     console.log(res.rows);
  //   });

  // console.log('--- INSERT PROFILE ---');
  // await dbms
  //   .query('INSERT INTO public.profile (name) VALUES ($1);', ['guest'])
  //   .then((res) => {
  //     console.log(res.rowCount > 0);
  //   });

  // console.log('--- UPDATE PROFILE ---');
  // await dbms
  //   .query('UPDATE public.profile SET description = $1 WHERE name = $2;', [
  //     'guest',
  //     'guest',
  //   ])
  //   .then((res) => {
  //     console.log(res);
  //   });

  // console.log('--- DELETE PROFILE ---');
  // await dbms
  //   .query('DELETE FROM public.profile WHERE name = $1;', ['guest'])
  //   .then((res) => {
  //     console.log(res.rowCount > 0);
  //   });

  // console.log(await dbms
  //   .setUserProfile({
  //     username: 'Bustos1',
  //     profile: PROFILES.EVENT_ADMIN.name,
  //   })
  //   .then((res) => res));

  console.log(
    await dbms
      .setUsersProfiles({
        Bustos1: [PROFILES.SECURITY_ADMIN.name, PROFILES.PARTICIPANT.name],
      })
      .then((res) => res)
  );

  // await dbms
  //   .getUsersWhere({
  //     keyValueData: {
  //       username: 'Bustos1',
  //     },
  //   })
  //   .then(async (res) => {
  //     // Get the profiles of the first user
  //     const userId = res.data[0].id;
  //     await dbms
  //       .getUserProfilesWhere({
  //         keyValueData: {
  //           user_id: userId,
  //         },
  //       })
  //       .then((resProfiles) => {
  //         console.log('User Profiles:', resProfiles);
  //       });
  //   });

  await dbms.poolDisconnection();
};

trailMethods();
