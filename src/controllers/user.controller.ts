import { FastifyReply } from 'fastify';
import { IUserRequest } from '../interfaces';
import { prisma } from '../helpers/utils';
import { ERRORS, handleServerError } from '../helpers/errors';
import * as JWT from 'jsonwebtoken';
import { Utils } from '../helpers/utils';
import { ERROR500, ERROR400, STANDARD } from '../helpers/constants';
import configLoader from '../config';

const APP_JWT_SECRET = configLoader().APP_JWT_SECRET;


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
    const checkPass = await Utils.compareHash(user.password, password);
    
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
      APP_JWT_SECRET,
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

export const getAllUsers = async (request: IUserRequest, reply: FastifyReply) => {
  console.log('getAllUsers function called')
  try {
    const users = await prisma.user.findMany();
    reply.code(STANDARD.SUCCESS).send(users);
  } catch (err) {
    console.log('error occurred', err)
    handleServerError(reply, err);
    }
};

export const authenticate = async (request, reply, done) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const decoded = JWT.verify(token, APP_JWT_SECRET);
    request.authUser = decoded;
    done();
  } catch (err) {
    reply.code(401).send({ message: 'Unauthorized' });
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
    const hashPass = await Utils.genSalt(10, password);
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
      APP_JWT_SECRET,
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
