/* eslint-disable */
const expect = require('chai').expect;

describe('Array', () => {
  describe('#sort', () => {
    it('should sort the array by name', () => {
      const names = ['misha', 'betsalel', 'dagi', 'yossi'];
      expect(names.sort()).to.be.eql(['betsalel', 'dagi', 'misha', 'yossi']);
    });
  });
});
