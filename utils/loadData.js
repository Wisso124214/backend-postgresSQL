import { dbClientQuery } from '#src/db.js';

export const loadData = async () => {
  dbClientQuery('SELECT * FROM public."user"').then((res) => {
    console.log('rows:', JSON.stringify(res.rows, null, 2));
  });

  // Llamadas
  // const profiles = ['administrador de seguridad', 'administrador de eventos', 'participante']
  // await postProfiles(profiles);
  // await printProfiles();
  // await printAllUsers();
};

loadData();
