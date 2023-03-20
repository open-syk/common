import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
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

export class SykConfigSingleton {
  private wasCompleted: boolean;
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

  public run(pathFile: string): void {
    if (this.wasCompleted && pathFile === this.previousPath) {
      return;
    }
    this.previousPath = pathFile;
    this.wasCompleted = true;
    const pathFileEnv = getEnvPath(pathFile);

    dotenv.config({ path: pathFileEnv });
  }
}
