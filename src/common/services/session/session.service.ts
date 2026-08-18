import { Injectable, Scope } from '@nestjs/common'
import { User } from 'src/models/user'

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  public userId: string
  public role: string

  setUser (user: User) {
    this.userId = user.id
    this.role = user.role
  }

  getUserId () {
    return this.userId
  }

  getRole () {
    return this.role
  }
}
