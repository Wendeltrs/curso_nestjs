import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  },
}));
