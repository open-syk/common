import path from 'path';

import { SykConfigSingleton } from '../src/config';

describe('@open-syk/config', () => {
  let config: SykConfigSingleton;

  beforeAll(() => {
    config = SykConfigSingleton.getInstance();
    config.run(path.join(__dirname, 'env'));
  });

  it('should be a number port', () => {
    expect(process.env.PORT).toEqual('1234');
  });

  it('should be a open syk name', () => {
    expect(process.env.NAME).toEqual('Open Syk');
  });

  it('should be undefined', () => {
    expect(process.env.UNKNOW).toBeUndefined();
  });
});
