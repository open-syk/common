import { existsSync } from 'fs';
import nconf from 'nconf';
import * as path from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = path.resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  let filePath: string = path.resolve(`${dest}/${filename}`);
  if (!existsSync(filePath)) {
    filePath = fallback;
  }
  return filePath;
}

export default class SykConfigSingleton {
  private wasCompleted: boolean;
  private data: any;
  private static instance: SykConfigSingleton;
  private previousPath: string;

  private constructor() {
    this.wasCompleted = false;
    this.previousPath = '';
  }

  public static getInstance(): SykConfigSingleton {
    if (!SykConfigSingleton.instance) {
      SykConfigSingleton.instance = new SykConfigSingleton();
    }
    return SykConfigSingleton.instance;
  }

  public run(pathFile: string): any {
    if (this.wasCompleted && pathFile === this.previousPath) {
      return this.data;
    }
    this.previousPath = pathFile;
    this.wasCompleted = true;
    const pathFileEnv = getEnvPath(pathFile);
    nconf.argv().env({ separator: '__', parseValues: true, lowerCase: false });
    nconf.defaults({ conf: path.resolve(pathFileEnv) });
    nconf.file(nconf.get('conf'));
    this.data = nconf;
    return this.data;
  }
}
