import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;

  beforeEach(async () => {
    user = new User();
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash('yeetmageet123', user.salt);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      const result = await user.validatePassword('yeetmageet123');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      const result = await user.validatePassword('wrong');
      expect(result).toEqual(false);
    });
  });
});
