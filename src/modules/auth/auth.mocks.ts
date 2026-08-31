import { mockedUsers } from '../users/users.mocks'

export const mockedSignUp = {
  name: mockedUsers[0].name,
  email: mockedUsers[0].email,
  password: mockedUsers[0].password,
}

export const mockedSignIn = {
  email: mockedUsers[0].email,
  password: mockedUsers[0].password,
}

export const mockedReturnAuth = {
  token: 'token',
  user: {
    id: mockedUsers[0].id,
    name: mockedUsers[0].name,
    email: mockedUsers[0].email,
    role: mockedUsers[0].role,
  },
}