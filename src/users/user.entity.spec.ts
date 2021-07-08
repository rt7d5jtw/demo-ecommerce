import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;

  beforeEach(async () => {
    user = new User();
    user.password = 'yeetmageet123';
    user.salt = await bcrypt.genSalt();
    jest.spyOn(bcrypt, 'hash');

    jest.clearAllMocks();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('yeetmageet123');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', user.salt);
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('wrong');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrong');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrong', user.salt);
      expect(result).toEqual(false);
    });
  });
});
