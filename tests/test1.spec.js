/* eslint-disable */
import { expect } from 'chai';

describe('Array', () => {
  describe('#sort', () => {
    it('should sort the array by name', () => {
      const names = ['misha', 'betsalel', 'dagi', 'yossi'];
      expect(names.sort()).to.be.eql(['betsalel', 'dagi', 'misha', 'yossi']);
    });
  });
});
