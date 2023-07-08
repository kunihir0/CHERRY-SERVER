import { FastifyReply } from 'fastify';
import { IUserRequest } from '../interfaces';
import { prisma } from '../helpers/utils';
import { ERRORS, handleServerError } from '../helpers/errors';
import * as JWT from 'jsonwebtoken';
import { utils } from '../helpers/utils';
import { ERROR500, ERROR400, STANDARD } from '../helpers/constants';

export const login = async (request: IUserRequest, reply: FastifyReply) => {
  console.log('login function called')
  try {
    const { email, password } = request.body;
    console.log('finding user')
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      console.log('user not found')
      reply.code(ERROR400.statusCode).send(ERRORS.userNotExists);
      return;
    }
    console.log('checking password')
    const checkPass = await utils.compareHash(password, user.password);
    if (!checkPass) {
      console.log('password incorrect')
      reply.code(ERROR400.statusCode).send(ERRORS.userCredError);
      return;
    }
    console.log('generating token')
    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.APP_JWT_SECRET,
    );
    console.log('sending response')
    reply.code(STANDARD.SUCCESS).send({
      token,
      user,
    });
  } catch (err) {
    console.log('error occurred', err)
    handleServerError(reply, err);
  }
};

export const signUp = async (request: IUserRequest, reply: FastifyReply) => {
  console.log('signUp function called')
  try {
    const { email, password, firstName, lastName } = request.body;
    console.log('finding user')
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) {
      console.log('user already exists')
      reply.code(409).send(ERRORS.userExists);
      return;
    }
    console.log('hashing password')
    const hashPass = await utils.genSalt(10, password);
    console.log('creating user')
    const createUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: String(hashPass),
      },
    });
    console.log('generating token')
    const token = JWT.sign(
      {
        id: createUser.id,
        email: createUser.email,
      },
      process.env.APP_JWT_SECRET,
    );
    delete (createUser as any).password;
    console.log('sending response')
    reply.code(STANDARD.SUCCESS).send({
      token,
      user: createUser,
    });
  } catch (err) {
    console.log('error occurred', err)
    handleServerError(reply, err);
  }
};
