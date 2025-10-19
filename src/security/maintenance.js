import DB from '#src/db.js';

const db = new DB();
const tableNames = [
  'user',
  'profile',
  'subsystem',
  'class',
  'method',
  'menu',
  'transaction',
  'menu_profile',
  'method_profile',
  'user_profile',
];
let exports = {};

export const createMaintenance = () => {
  tableNames.forEach((tableName) => {
    createMaintenanceTableName(tableName);
  });
};

const createMaintenanceTableName = (tableName) => {
  const tableNameToFunction = tableName
    .split('_')
    .map(toUpperCaseFirstLetter)
    .join('');

  exports[`get${tableNameToFunction}s`] = (req, res) => {
    db.dbClientQuery(`SELECT * FROM public.${tableName}`, [])
      .then((result) => {
        res.send(result.rows);
      })
      .catch((error) => {
        console.error(`Error fetching ${tableName}s:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };

  exports[`get${tableNameToFunction}sWhere`] = (req, res) => {
    const fields = Object.keys(req.params || req.body || {});
    const values = Object.values(req.params || req.body || {});

    const query = `SELECT * FROM public.${tableName} WHERE ${fields.map((f, i) => `${f} = $${i + 1}`).join(' AND ')};`;
    db.dbClientQuery(query, values)
      .then((result) => {
        res.send(result.rows);
      })
      .catch((error) => {
        console.error(`Error fetching ${tableName}s:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };

  exports[`update${tableNameToFunction}ById`] = (req, res) => {
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
    db.dbClientQuery(updateQuery, [...Object.values(req.body), id])
      .then(() => {
        res.send({ message: 'Registro actualizado correctamente' });
      })
      .catch((error) => {
        console.error(`Error updating ${tableName}:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };

  exports[`update${tableNameToFunction}ByUsername`] = (req, res) => {
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
    db.dbClientQuery(updateQuery, [...Object.values(req.body), username])
      .then(() => {
        res.send({ message: 'Registro actualizado correctamente' });
      })
      .catch((error) => {
        console.error(`Error updating ${tableName}:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };

  exports[`delete${tableNameToFunction}ByUsername`] = (req, res) => {
    const { username } = req.params;
    const deleteQuery = `DELETE FROM public.${tableName} WHERE username = $1;`;
    db.dbClientQuery(deleteQuery, [username])
      .then(() => {
        res.send({ message: 'Registro eliminado correctamente' });
      })
      .catch((error) => {
        console.error(`Error eliminando ${tableName}:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };

  exports[`delete${tableNameToFunction}ById`] = (req, res) => {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM public.${tableName} WHERE id = $1;`;
    db.dbClientQuery(deleteQuery, [id])
      .then(() => {
        res.send({ message: 'Registro eliminado correctamente' });
      })
      .catch((error) => {
        console.error(`Error eliminando ${tableName}:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };

  exports[`deleteAll${tableNameToFunction}s`] = (req, res) => {
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
    db.dbClientQuery(deleteQuery, [])
      .then(() => {
        res.send({
          message: `Todos los ${tableName} han sido eliminados correctamente`,
        });
      })
      .catch((error) => {
        console.error(`Error eliminando ${tableName}:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };

  exports[`delete${tableNameToFunction}sWhere`] = (req, res) => {
    const { fields, values } = req.params;

    const query = `DELETE FROM public.${tableName} WHERE ${fields.map((f, i) => `${f} = $${i + 1}`).join(' AND ')};`;
    db.dbClientQuery(query, values)
      .then(() => {
        res.send({ message: `${tableName} eliminados correctamente` });
      })
      .catch((error) => {
        console.error(`Error eliminando ${tableName}:`, error);
        res.status(500).send({ errorCode: 500, message: 'Error del servidor' });
      });
  };
};

const toUpperCaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default exports;
