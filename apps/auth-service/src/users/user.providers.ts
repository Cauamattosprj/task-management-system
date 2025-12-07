import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { USER_DATA_SOURCE, USER_REPOSITORY } from './constants';
export const photoProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [USER_DATA_SOURCE],
  },
];
