import { profiles } from '#config/config.js';

const { SUPER_ADMIN, SECURITY_ADMIN, EVENT_ADMIN, PARTICIPANT } = Object.keys(
  profiles
).reduce((acc, key) => {
  acc[key] = profiles[key].name;
  return acc;
}, {});

//db structure

/**
 * subsystems: {
 *   subsystem: {
 *     class: {
 *       method: {
 *        description: 'Descripción del método',
 *        allowedProfiles: [profiles], // Perfiles permitidos para acceder a este método
 *     }
 *   }
 * }
 */

export const subsystems = {
  security: {
    description: 'Subsistema de seguridad',
    classes: {
      dbms: {
        description: 'Gestión de la base de datos',
        methods: {
          init: {
            description:
              'Crea los métodos de mantenimiento para las tablas de la base de datos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          connection: {
            description:
              'Establece una conexión con el cliente de la base de datos, a través de un pool de conexiones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          disconnection: {
            description:
              'Cierra la conexión con el cliente de la base de datos, liberando el pool de conexiones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          poolDisconnection: {
            description: 'Termina el pool de conexiones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          query: {
            description: 'Realiza una consulta en la base de datos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          createMaintenance: {
            description:
              'Crea los métodos para el mantenimiento de las tablas en la base de datos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          createMaintenanceTableName: {
            description:
              'Crea los métodos para mantener una tabla en la base de datos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          toUpperCaseFirstLetter: {
            description:
              'Convierte la primera letra de una cadena a mayúsculas',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getAllDinamicMethodNames: {
            description: 'Obtiene todos los nombres de métodos dinámicos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          setProfileToUser: {
            description: 'Asigna un perfil a un usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          setProfilesToUser: {
            description: 'Asigna múltiples perfiles a un usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          setProfilesToUsers: {
            description: 'Asigna múltiples perfiles a múltiples usuarios',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getProfilesOfUser: {
            description: 'Obtiene los perfiles de un usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getProfilesOfUsers: {
            description: 'Obtiene los perfiles de múltiples usuarios',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },

          // Añadir métodos de mantenimiento avanzado

          getUsers: {
            description: 'Obtiene todos los usuarios',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getUsersWhere: {
            description: 'Obtiene usuarios que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertUser: {
            description: 'Inserta un nuevo usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateUserById: {
            description: 'Actualiza un usuario por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateUserByUsername: {
            description: 'Actualiza un usuario por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteUserByUsername: {
            description: 'Elimina un usuario por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteUserById: {
            description: 'Elimina un usuario por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllUsers: {
            description: 'Elimina todos los usuarios',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteUsersWhere: {
            description: 'Elimina usuarios que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getProfiles: {
            description: 'Obtiene todos los perfiles',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getProfilesWhere: {
            description: 'Obtiene perfiles que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertProfile: {
            description: 'Inserta un nuevo perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateProfileById: {
            description: 'Actualiza un perfil por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateProfileByUsername: {
            description: 'Actualiza un perfil por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteProfileByUsername: {
            description: 'Elimina un perfil por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteProfileById: {
            description: 'Elimina un perfil por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllProfiles: {
            description: 'Elimina todos los perfiles',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteProfilesWhere: {
            description: 'Elimina perfiles que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getSubsystems: {
            description: 'Obtiene todos los subsistemas',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getSubsystemsWhere: {
            description:
              'Obtiene subsistemas que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertSubsystem: {
            description: 'Inserta un nuevo subsistema',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateSubsystemById: {
            description: 'Actualiza un subsistema por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateSubsystemByUsername: {
            description: 'Actualiza un subsistema por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteSubsystemByUsername: {
            description: 'Elimina un subsistema por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteSubsystemById: {
            description: 'Elimina un subsistema por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllSubsystems: {
            description: 'Elimina todos los subsistemas',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteSubsystemsWhere: {
            description:
              'Elimina subsistemas que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getClasss: {
            description: 'Obtiene todas las clases',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getClasssWhere: {
            description: 'Obtiene clases que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertClass: {
            description: 'Inserta una nueva clase',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateClassById: {
            description: 'Actualiza una clase por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateClassByUsername: {
            description: 'Actualiza una clase por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteClassByUsername: {
            description: 'Elimina una clase por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteClassById: {
            description: 'Elimina una clase por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllClasss: {
            description: 'Elimina todas las clases',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteClasssWhere: {
            description: 'Elimina clases que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getMethods: {
            description: 'Obtiene todos los métodos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getMethodsWhere: {
            description: 'Obtiene métodos que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertMethod: {
            description: 'Inserta un nuevo método',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateMethodById: {
            description: 'Actualiza un método por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateMethodByUsername: {
            description: 'Actualiza un método por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMethodByUsername: {
            description: 'Elimina un método por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMethodById: {
            description: 'Elimina un método por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllMethods: {
            description: 'Elimina todos los métodos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMethodsWhere: {
            description: 'Elimina métodos que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getMenus: {
            description: 'Obtiene todos los menús',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getMenusWhere: {
            description: 'Obtiene menús que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertMenu: {
            description: 'Inserta un nuevo menú',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateMenuById: {
            description: 'Actualiza un menú por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateMenuByUsername: {
            description: 'Actualiza un menú por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMenuByUsername: {
            description: 'Elimina un menú por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMenuById: {
            description: 'Elimina un menú por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllMenus: {
            description: 'Elimina todos los menús',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMenusWhere: {
            description: 'Elimina menús que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getOptions: {
            description: 'Obtiene todas las opciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getOptionsWhere: {
            description: 'Obtiene opciones que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertOption: {
            description: 'Inserta una nueva opción',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateOptionById: {
            description: 'Actualiza una opción por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateOptionByUsername: {
            description: 'Actualiza una opción por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteOptionByUsername: {
            description: 'Elimina una opción por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteOptionById: {
            description: 'Elimina una opción por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllOptions: {
            description: 'Elimina todas las opciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteOptionsWhere: {
            description: 'Elimina opciones que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getTransactions: {
            description: 'Obtiene todas las transacciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getTransactionsWhere: {
            description:
              'Obtiene transacciones que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertTransaction: {
            description: 'Inserta una nueva transacción',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateTransactionById: {
            description: 'Actualiza una transacción por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateTransactionByUsername: {
            description: 'Actualiza una transacción por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteTransactionByUsername: {
            description: 'Elimina una transacción por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteTransactionById: {
            description: 'Elimina una transacción por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllTransactions: {
            description: 'Elimina todas las transacciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteTransactionsWhere: {
            description:
              'Elimina transacciones que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getOptionProfiles: {
            description: 'Obtiene todos los permisos de opciones a perfiles',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getOptionProfilesWhere: {
            description:
              'Obtiene permisos de opciones a perfiles que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertOptionProfile: {
            description: 'Inserta un nuevo permiso de opción a perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateOptionProfileById: {
            description: 'Actualiza un permiso de opción a perfil por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateOptionProfileByUsername: {
            description:
              'Actualiza un permiso de opción a perfil por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteOptionProfileByUsername: {
            description:
              'Elimina un permiso de opción a perfil por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteOptionProfileById: {
            description: 'Elimina un permiso de opción a perfil por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllOptionProfiles: {
            description: 'Elimina todos los permisos de opción a perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteOptionProfilesWhere: {
            description:
              'Elimina permisos de opción a perfil que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getMethodProfiles: {
            description: 'Obtiene todos los permisos de métodos a perfiles',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getMethodProfilesWhere: {
            description:
              'Obtiene permisos de métodos a perfiles que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertMethodProfile: {
            description: 'Inserta un nuevo permiso de método a perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateMethodProfileById: {
            description: 'Actualiza un permiso de método a perfil por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateMethodProfileByUsername: {
            description:
              'Actualiza un permiso de método a perfil por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMethodProfileByUsername: {
            description:
              'Elimina un permiso de método a perfil por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMethodProfileById: {
            description: 'Elimina un permiso de método a perfil por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllMethodProfiles: {
            description: 'Elimina todos los permisos de método a perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteMethodProfilesWhere: {
            description:
              'Elimina permisos de método a perfil que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getUserProfiles: {
            description: 'Obtiene todos los perfiles de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getUserProfilesWhere: {
            description:
              'Obtiene perfiles de usuario que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          insertUserProfile: {
            description: 'Inserta un nuevo perfil de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateUserProfileById: {
            description: 'Actualiza un perfil de usuario por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateUserProfileByUsername: {
            description:
              'Actualiza un perfil de usuario por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteUserProfileByUsername: {
            description:
              'Elimina un perfil de usuario por su nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteUserProfileById: {
            description: 'Elimina un perfil de usuario por su ID',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteAllUserProfiles: {
            description: 'Elimina todos los perfiles de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          deleteUserProfilesWhere: {
            description:
              'Elimina perfiles de usuario que cumplen con ciertas condiciones',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
      security: {},
    },
  },

  session: {
    description: 'Subsistema de gestión de sesiones',
    classes: {
      session: {
        description: 'Gestión de sesiones',
        methods: {
          init: {
            description: 'Inicializa el manejo de sesiones en la aplicación',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getAllDinamicMethodNames: {
            description: 'Obtiene todos los nombres de métodos dinámicos',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          createAndUpdateSession: {
            description:
              'Crea y actualiza una sesión con los datos proporcionados',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          createSession: {
            description: 'Crea una nueva sesión',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          destroySession: {
            description: 'Destruye una sesión existente',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          existSession: {
            description: 'Verifica si una sesión existe',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getSession: {
            description: 'Obtiene una sesión existente',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          updateSession: {
            description: 'Actualiza una sesión existente',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          createRoutes: {
            description: 'Crea nuevas rutas para la aplicación',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
    },
  },

  services: {
    description: 'Subsistema de servicios',
    classes: {
      mailer: {
        description: 'Servicio de envío de correos electrónicos',
        methods: {
          sendEmail: {
            description: 'Envía un correo electrónico',
            allowedProfiles: [
              SUPER_ADMIN,
              SECURITY_ADMIN,
              EVENT_ADMIN,
              PARTICIPANT,
            ],
          },
          sendRecoveryEmail: {
            description: 'Envía un correo electrónico de recuperación',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
      tokenizer: {
        description: 'Servicio de generación y verificación de tokens',
        methods: {
          generateToken: {
            description: 'Genera un nuevo token',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          verifyToken: {
            description: 'Verifica un token existente',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
      validator: {
        description: 'Servicio de validación de datos',
        methods: {
          validateUsername: {
            description: 'Valida un nombre de usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          validateEmail: {
            description: 'Valida un correo electrónico',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          validatePassword: {
            description: 'Valida una contraseña',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          validateConfirmPassword: {
            description: 'Valida la confirmación de la contraseña',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          getValidationValues: {
            description: 'Obtiene los valores de validación',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          validateName: {
            description: 'Valida un nombre',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          validateDescription: {
            description: 'Valida una descripción',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
    },
  },
};

/**
 * menus: {
 *   subsystem: {
 *     menu: {
 *       submenu: {
 *         option: {
 *           description: 'Descripción de la opción',
 *           allowedProfiles: [profiles], // Perfiles permitidos para acceder a esta opción
 *         }
 *     }
 *   }
 * }
 */

export const menus = {
  security: {
    'Gestión de Perfiles': {
      description: 'Gestión de Perfiles de Usuario y sus Permisos',
      submenu: {
        'Mantenimiento de Perfiles': {
          description: 'Crear, Actualizar, Eliminar y Listar Perfiles',
          options: {
            'Crear Perfil': {
              description: 'Crear un nuevo Perfil de Usuario',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Actualizar Perfil': {
              description: 'Actualizar un Perfil de Usuario existente',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Eliminar Perfil': {
              description: 'Eliminar un Perfil de Usuario existente',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Listar Perfiles': {
              description: 'Listar todos los Perfiles de Usuario',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
          },
        },
      },
      'Gestión de Opciones a Perfiles': {
        description: 'Asignar y Remover Permisos de Opciones a Perfiles',
        options: {
          'Asignar Permiso de Opción a Perfil': {
            description: 'Asignar un Permiso de Opción a un Perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          'Remover Permiso de Opción de Perfil': {
            description: 'Remover un Permiso de Opción de un Perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
      'Gestión de Métodos a Perfiles': {
        description: 'Asignar y Remover Permisos de Métodos a Perfiles',
        options: {
          'Asignar Permiso de Método a Perfil': {
            description: 'Asignar un Permiso de Método a un Perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          'Remover Permiso de Método de Perfil': {
            description: 'Remover un Permiso de Método de un Perfil',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
      'Gestión de Perfiles a Usuarios': {
        description: 'Asignar y Remover Perfiles a Usuarios',
        options: {
          'Asignar Perfil a Usuario': {
            description: 'Asignar un Perfil a un Usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
          'Remover Perfil de Usuario': {
            description: 'Remover un Perfil de un Usuario',
            allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
          },
        },
      },
    },
    'Gestión de Usuarios': {
      description: 'Crear, Actualizar, Eliminar y Listar Usuarios',
      options: {
        'Cambiar perfil activo': {
          description: 'Cambiar el perfil activo de un Usuario',
          allowedProfiles: [
            SUPER_ADMIN,
            SECURITY_ADMIN,
            EVENT_ADMIN,
            PARTICIPANT,
          ],
        },
        'Actualizar mi usuario': {
          description: 'Actualizar mi información de Usuario',
          allowedProfiles: [
            SUPER_ADMIN,
            SECURITY_ADMIN,
            EVENT_ADMIN,
            PARTICIPANT,
          ],
        },
        'Crear Usuario': {
          description: 'Crear un nuevo Usuario',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Actualizar Usuario': {
          description: 'Actualizar un Usuario existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Eliminar Usuario': {
          description: 'Eliminar un Usuario existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Listar Usuarios': {
          description: 'Listar todos los Usuarios',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
      },
    },
    'Gestión de Subsistemas': {
      description: 'Crear, Actualizar, Eliminar y Listar Subsistemas',
      options: {
        'Cambiar subsistema activo': {
          description: 'Cambiar el subsistema activo de un Usuario',
          allowedProfiles: [
            SUPER_ADMIN,
            SECURITY_ADMIN,
            EVENT_ADMIN,
            PARTICIPANT,
          ],
        },
        'Crear Subsistema': {
          description: 'Crear un nuevo Subsistema',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Actualizar Subsistema': {
          description: 'Actualizar un Subsistema existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Eliminar Subsistema': {
          description: 'Eliminar un Subsistema existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Listar Subsistemas': {
          description: 'Listar todos los Subsistemas',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
      },
    },
    'Gestión de Clases': {
      description: 'Crear, Actualizar, Eliminar y Listar Clases',
      options: {
        'Crear Clase': {
          description: 'Crear una nueva Clase',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Actualizar Clase': {
          description: 'Actualizar una Clase existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Eliminar Clase': {
          description: 'Eliminar una Clase existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Listar Clases': {
          description: 'Listar todas las Clases',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
      },
    },
    'Gestión de Métodos': {
      description: 'Crear, Actualizar, Eliminar y Listar Métodos',
      options: {
        'Crear Método': {
          description: 'Crear un nuevo Método',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Actualizar Método': {
          description: 'Actualizar un Método existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Eliminar Método': {
          description: 'Eliminar un Método existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Listar Métodos': {
          description: 'Listar todos los Métodos',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
      },
    },
    'Gestión de Opciones': {
      description: 'Crear, Actualizar, Eliminar y Listar Opciones',
      options: {
        'Crear Opción': {
          description: 'Crear una nueva Opción',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Actualizar Opción': {
          description: 'Actualizar una Opción existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Eliminar Opción': {
          description: 'Eliminar una Opción existente',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
        'Listar Opciones': {
          description: 'Listar todas las Opciones',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
        },
      },
    },
    'Gestión de Menús': {
      description: 'Crear, Actualizar, Eliminar y Listar Menús y Submenús',
      submenu: {
        'Mantenimiento de Menús': {
          description: 'Crear, Actualizar, Eliminar y Listar Menús',
          options: {
            'Crear Menú': {
              description: 'Crear un nuevo Menú',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Actualizar Menú': {
              description: 'Actualizar un Menú existente',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Eliminar Menú': {
              description: 'Eliminar un Menú existente',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Listar Menús': {
              description: 'Listar todos los Menús',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
          },
        },
        'Mantenimiento de Submenús': {
          description: 'Crear, Actualizar, Eliminar y Listar Submenús',
          options: {
            'Crear Submenú': {
              description: 'Crear un nuevo Submenú',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Actualizar Submenú': {
              description: 'Actualizar un Submenú existente',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Eliminar Submenú': {
              description: 'Eliminar un Submenú existente',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
            'Listar Submenús': {
              description: 'Listar todos los Submenús',
              allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN],
            },
          },
        },
      },
    },
  },

  session: {
    'Gestión de Sesión': {
      description: 'Gestión de la Sesión del Usuario',
      options: {
        'Cambiar Contraseña': {
          description: 'Cambiar la contraseña del usuario',
          allowedProfiles: [
            SUPER_ADMIN,
            SECURITY_ADMIN,
            EVENT_ADMIN,
            PARTICIPANT,
          ],
        },
        'Registrar nuevo Usuario': {
          description: 'Registrar un nuevo usuario en el sistema',
          allowedProfiles: [SUPER_ADMIN, SECURITY_ADMIN, EVENT_ADMIN],
        },
        'Cerrar Sesión': {
          description: 'Cerrar la sesión del usuario',
          allowedProfiles: [
            SUPER_ADMIN,
            SECURITY_ADMIN,
            EVENT_ADMIN,
            PARTICIPANT,
          ],
        },
      },
    },
  },

  services: {
    Otros: {
      description: 'Servicios variados del sistema',
      options: {
        'Enviar Email': {
          description: 'Enviar un correo electrónico',
          allowedProfiles: [
            SUPER_ADMIN,
            SECURITY_ADMIN,
            EVENT_ADMIN,
            PARTICIPANT,
          ],
        },
      },
    },
  },
};
