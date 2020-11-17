import { User } from './user';

export interface Report {
    id: number,
    author: User,
    supervisors: User[],
    message: string
}