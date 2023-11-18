const { ServerResponse } = require('http');

import IRoute from '../types/IRoute';
import {Router, Request, Response} from 'express';
import {compareSync} from 'bcrypt';
import {attachSession} from '../middleware/auth';
import {sequelize, Session, User} from '../services/db';
import {randomBytes} from 'crypto';
import {hashSync} from 'bcrypt';

import { UserType } from '../../../globalTypes'

/****************************************************************/
const respondSessionCookie = (res: Response, sessionToken: string, makeExpired: boolean) => {
  const expires = makeExpired ?
    new Date(Date.now() - (100 * 365 * 24 * 60 * 60 * 1000)) : // 100 years agoe
    new Date(Date.now() + (3600 * 24 * 7 * 1000)) // a week from now

  res.cookie('SESSION_TOKEN', sessionToken, {
    expires,
    secure: false,
    httpOnly: true,
  });
}


const validCredentials: any = (req: Request, res: Response) => {
  const {
    username,
    password,
  } = req.body;
  if (!username || !password) {
    const itemMissing = !username ? 'username' : 'password'

    return res.status(400).json({
      success: false,
      message: `Missing ${itemMissing}`,
      fieldMissing: itemMissing
    });
  }

  return { username, password }
}

// Returns null if no user is found
const getUser = async (username: string) => {
  const user = await User.findOne({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('username')),
      sequelize.fn('lower', username),
    ),
  }).catch(err => console.error('User lookup failed.', err))

  return user;
}

const createSession = async (res: Response, user) => {
  const sessionToken = randomBytes(32).toString('hex');

  try {
    // Persist the token to the database.
    const session = await Session.create({
      token: sessionToken,
      user: user.dataValues.id,
    });

    return { session, sessionToken }
  } catch (e) {
    return passError('Failed to create session.', e, res);
  }
}

const createUser = async (res: Response, creds) => {
  try {
    const now = new Date(Date.now())

    // Persist the token to the database.
    const newUser = await User.create({
      username: creds.username,
      password: hashSync(creds.password, 12),
      registered: now
    });

    // if(newUser) req.session.user = newUser

    return newUser
  } catch (e) {
    return passError('Failed to create user.', e, res);
  }
}
/****************************************************************/

const AuthRouter: IRoute = {
  route: '/auth',
  router() {
    const router = Router();
    router.use(attachSession);

    // If we're authenticated, return basic user data.
    router.get('/', (req: Request, res: Response) => {
      if (req.session?.token?.id) {
        const {
          token: {token, ...session},
          user: {password, ...user},
        } = req.session;
        return res.json({
          success: true,
          message: 'Authenticated',
          data: {
            session,
            user,
          },
        });
      } else {
        return res.json({
          success: false,
          message: 'Not Authenticated!',
        });
      }
    });

    // Attempt to log in
    router.post('/login', async (req: Request, res: Response) => {
      const creds = validCredentials(req, res)
      if (creds instanceof ServerResponse) return

      const { username, password } = creds
      const user = await getUser(username)

      // Ensure the user exists. If not, return an error.
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // Ensure the password is correct. If not, return an error.
      if (!compareSync(password, user.dataValues.password)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // We now know the user is valid so it's time to mint a new session token.
      const { session, sessionToken } = await createSession(res, user)

      if (!session) {
        // Something broke on the database side. Not much we can do.
        return passError('Returned session was nullish.', null, res);
      }

      // We set the cookie on the response so that browser sessions will
      // be able to use it.
      const makeExpired = false
      respondSessionCookie(res, sessionToken, makeExpired)

      // We return the cookie to the consumer so that non-browser
      // contexts can utilize it easily. This is a convenience for the
      // take-home so you don't have to try and extract the cookie from
      // the response headers etc. Just know that this is a-standard
      // in non-oauth flows :)
      return res.json({
        success: true,
        message: 'Authenticated Successfully.',
        data: {
          token: sessionToken,
        },
      });
    });

    // TODO: Attempt to register
    router.post('/register', async (req: Request, res: Response) => {
      const creds = validCredentials(req, res)
      if (creds instanceof ServerResponse) return

      const { username } = creds
      let user = await getUser(username)

      if (user) {
        return res.json({
          success: false,
          message: 'User already exists. Please login.'
        });
      }

      user = await createUser(res, creds)

      const { sessionToken } = await createSession(res, user)

      const makeExpired = false
      respondSessionCookie(res, sessionToken, makeExpired)

      return res.json({
        success: true,
        message: 'User Successfully Created.',
        data: {
          user: {...user, sessionToken}
        },
      });
    });

    // TODO: Log out
    router.post('/logout', (req: Request, res: Response) => {
      const { user }: { user: UserType} = req.body;
      const pastExpirationDate = new Date(Date.now() - (100 * 365 * 24 * 60 * 60 * 1000)); // 100 years
      
      const makeExpired = true
      respondSessionCookie(res, user.token, makeExpired)

      return res.json({
        success: true,
        message: 'Logged Out Successfully.',
        data: {
          token: user.token,
        },
      });
    });

    return router;
  },
};

export default AuthRouter;

function passError(message, error, response) {
  console.error(message, error);
  return response.status(500).json({
    success: false,
    message: `Internal: ${message}`,
  });
}
