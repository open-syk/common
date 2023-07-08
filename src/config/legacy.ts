import nconf from 'nconf';
import * as path from 'path';

const lowerCase = process.env['LOWER_CASE_ENV_VARS'] !== 'false';
nconf.argv().env({ separator: '__', parseValues: true, lowerCase });
nconf.defaults({ conf: path.resolve('config.json'), load_config_file: true });
if (nconf.get('load_config_file') as boolean) {
  nconf.file(nconf.get('conf') as string);
}

export default nconf;
