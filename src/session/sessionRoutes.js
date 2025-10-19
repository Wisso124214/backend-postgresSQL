import bcrypt from 'bcrypt';
import { SERVER_URL, profiles } from '#root/config.js';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '#src/validations.js';
import {
  createAndUpdateSession,
  destroySession,
  getSession,
  existSession,
  setProfileToUser,
  findUsers,
} from './sessionManager.js';
import { generateToken, verifyToken } from '#root/services/tokenManager.js';
import { sendRecoveryEmail } from '#root/services/emailService.js';
import { dbClientQuery } from '#src/db.js';

export const createSessionRoutes = async (app) => {
  app.post('/login', async (req, res) => {
    if (existSession(req, res)) {
      return res.send({
        message: `Ya has iniciado sesión. Cierra la sesión para continuar.`,
        redirect: '/home',
      });
    }

    const userData = req.body || JSON.parse(req.headers.data || '{}');

    dbClientQuery('SELECT * FROM public."user" WHERE username = $1', [
      userData.username,
    ])
      .then(async (result) => {
        if (
          !result ||
          !result.rows ||
          result.rows.length === 0 ||
          !result.rows[0]
        ) {
          return res
            .status(404)
            .send({ errorCode: 404, message: 'Usuario no encontrado' });
        } else if (result.rows.length > 1) {
          return res.status(400).send({
            errorCode: 400,
            message:
              'Se han encontrado múltiples usuarios con ese nombre de usuario. Por favor contacte al soporte.',
          });
        }
        const user = result?.rows[0];
        const passwordMatch = bcrypt.compareSync(
          userData.password,
          user.password
        );

        if (passwordMatch) {
          await dbClientQuery(
            'SELECT * FROM public."user_profile" INNER JOIN public."profile" ON "user_profile".id_profile = "profile".id WHERE "user_profile".id_user = $1',
            [user.id]
          ).then(async (userProfilesResult) => {
            const userProfiles = userProfilesResult.rows.map((up) => up.name);
            if (
              userData.activeProfile &&
              userProfiles.includes(userData.activeProfile)
            ) {
              createAndUpdateSession(req, userData);
              return res.send({
                message: `Bienvenido ${userData.activeProfile}, ${user.username}`,
              });
            } else if (userProfiles.length > 1) {
              return res.send({
                message: `Seleccione el perfil con el que desea iniciar sesión`,
                profiles: userProfiles,
              });
            } else {
              createAndUpdateSession(req, userData);
              return res.send({
                message: `Bienvenido ${userProfiles[0]}, ${user.username}`,
              });
            }
          });
        } else {
          return res
            .status(401)
            .send({ errorCode: 401, message: 'Credenciales inválidas' });
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        return res
          .status(500)
          .send({ errorCode: 500, message: 'Error del servidor' });
      });
  });

  app.post('/register', async (req, res) => {
    let userData = req.body || JSON.parse(req.headers.data || '{}');
    const { username, email, password, confirmPassword } = userData;
    const isParticipant =
      getSession(req)?.activeProfile === profiles.PARTICIPANT.name;

    if (existSession(req, res)) {
      if (isParticipant) {
        return res.send({
          message: `Ya has iniciado sesión. Cierra la sesión para continuar.`,
          redirect: '/home',
        });
      }
    }

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).send({
        errorCode: 400,
        message: 'Por favor llene todos los campos',
        userData,
      });
    }

    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );

    if (usernameError) {
      return res.status(400).send({ errorCode: 400, message: usernameError });
    }
    if (emailError) {
      return res.status(400).send({ errorCode: 400, message: emailError });
    }
    if (passwordError) {
      return res.status(400).send({ errorCode: 400, message: passwordError });
    }
    if (confirmPasswordError) {
      return res
        .status(400)
        .send({ errorCode: 400, message: confirmPasswordError });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Copia el resto de los datos del body y reemplaza la contraseña
    userData = {
      status: 'active',
      register_date: new Date().toISOString(),
      ...userData,
      password: hashedPassword,
    };

    if (isParticipant || !userData.activeProfile) {
      userData.activeProfile = profiles.PARTICIPANT.name;
    }

    createAndUpdateSession(req, userData);

    dbClientQuery(
      'INSERT INTO public."user" (username, password, email, status, register_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        userData.username,
        userData.password,
        userData.email,
        userData.status,
        userData.register_date,
      ]
    )
      .then(async (result) => {
        const postedUser = result?.rows[0];
        if (!postedUser) {
          return res
            .status(500)
            .send({ errorCode: 500, message: 'Error al registrar usuario' });
        }
        await setProfileToUser({ username, profile: userData.activeProfile });
        const loginObj = {
          username,
          password,
          activeProfile: userData.activeProfile,
        };

        await fetch(`${SERVER_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginObj),
        })
          .then((response) => response.text())
          .then((message) => res.send({ message }))
          .catch((error) => {
            console.error('Error al iniciar sesión:', error);
            res
              .status(500)
              .send({ errorCode: 500, message: 'Error al iniciar sesión' });
          });
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error);
        return res
          .status(500)
          .send({ errorCode: 500, message: 'Error al registrar usuario' });
      });
  });

  app.get('/logout', async (req, res) => {
    if (!existSession(req)) {
      res.send({ message: 'No has iniciado sesión.', redirect: '/login' });
      return;
    }
    const result = destroySession(req);
    res.send(result);
  });

  app.get('/home', async (req, res) => {
    if (!existSession(req)) {
      res.send({
        message: 'Debes iniciar sesión para acceder a esta página.',
        redirect: '/login',
      });
      return;
    }

    const sessionData = getSession(req);
    const message = `Bienvenido a la página principal, ${sessionData.activeProfile || 'participante'}, ${sessionData.username || 'invitado'}`;
    res.send({ message, sessionData });
    return;
  });

  app.post('/forgotPassword', async (req, res) => {
    // Validar el email que viene en los headers
    let userData = req.body || JSON.parse(req.headers.data || '{}');
    const { email } = userData;
    if (!email) {
      return res
        .status(400)
        .send({ errorCode: 400, message: 'Por favor ingrese su email' });
    }
    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).send({ errorCode: 400, message: emailError });
    }

    // Busca el usuario con ese email
    const data = await dbClientQuery(
      'SELECT * FROM public."user" WHERE email = $1;',
      [email]
    ).then((result) => result.rows);

    if (data?.length > 0) {
      // Si se encuentra el usuario, enviar un email con el token de recuperación
      if (data.length > 1) {
        return res.status(400).send({
          errorCode: 400,
          message:
            'Se han encontrado múltiples usuarios con ese email. Por favor contacte al soporte.',
        });
      }
      const user = data[0];
      const token = generateToken({
        user,
        email: user.email,
        userId: user.id,
      });
      // sendRecoveryEmail(user.email, token);
      // res.send({
      //   message: 'Se ha enviado un email de recuperación',
      //   userId: user.id,
      //   email: user.email,
      //   token,
      // });
      res.send({
        message: 'Se ha emulado el envío del email de recuperación',
        userId: user.id,
        email: user.email,
        token,
      });
    } else {
      res
        .status(404)
        .send({ errorCode: 404, message: 'Usuario no encontrado' });
    }
  });

  app.post('/resetPassword', async (req, res) => {
    // Validar el token que viene en los headers
    let userData = req.body || JSON.parse(req.headers.data || '{}');
    const { token, password, confirmPassword, userId } = userData;
    if (!token) {
      return res.status(500).send({
        errorCode: 500,
        message: 'Error del servidor al conseguir el token',
      });
    }

    if (!userId) {
      return res.status(500).send({
        errorCode: 500,
        message: 'Error del servidor al conseguir el id de usuario',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(400).send({
        errorCode: 400,
        message: 'Token inválido o expirado. Por favor intente nuevamente',
      });
    }

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .send({ errorCode: 400, message: 'Por favor llene todos los campos' });
    }

    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );
    if (passwordError) {
      return res.status(400).send({ errorCode: 400, message: passwordError });
    }
    if (confirmPasswordError) {
      return res
        .status(400)
        .send({ errorCode: 400, message: confirmPasswordError });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updatedUser = { ...decoded.user, password: hashedPassword };

    dbClientQuery('UPDATE public."user" SET password = $1 WHERE id = $2;', [
      updatedUser.password,
      userId,
    ])
      .then(() => {
        res.send({
          message: `Contraseña actualizada correctamente para el usuario . Por favor inicie sesión con su nueva contraseña.`,
          redirect: '/login',
        });
      })
      .catch((error) => {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).send({
          errorCode: 500,
          message:
            'Error al actualizar la contraseña. El email ingresado no está asociado a ningún usuario registrado.',
        });
      });
  });
};
