import admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export interface FirebaseConfigEnv {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  clientC509CertUrl: string;
}

export enum OpenSykFirebaseErrorMessage {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  UPDATING_USER_ERROR = 'UPDATING_USER_ERROR',
  DELETING_USER_ERROR = 'DELETING_USER_ERROR',
  INVALID_JWT_TOKEN = 'INVALID_JWT_TOKEN',
  SIGN_UP_ERROR = 'SIGN_UP_ERROR',
  FIREBASE_CREDENTIALS_NOT_FOUND = 'FIREBASE_CREDENTIALS_NOT_FOUND',
}

export class FirebaseConfigSingleton {
  private static instance: FirebaseConfigSingleton;
  private config: Record<string, admin.app.App> = {};

  private constructor() {
    const FIREBASE_CREDENTIALS = process.env.FIREBASE_CREDENTIALS;
    if (!FIREBASE_CREDENTIALS) {
      throw Error(OpenSykFirebaseErrorMessage.FIREBASE_CREDENTIALS_NOT_FOUND);
    }
    const firebaseConfigEnv: Record<string, FirebaseConfigEnv> = JSON.parse(FIREBASE_CREDENTIALS || '{}');

    const clientIds = Object.keys(firebaseConfigEnv) as Array<string>;

    for (const clientId of clientIds) {
      const credentials: admin.AppOptions = {
        credential: admin.credential.cert(firebaseConfigEnv[clientId]),
      };
      this.config[clientId] = admin.initializeApp(credentials, clientId);
    }
  }

  static getInstance() {
    if (!FirebaseConfigSingleton.instance) {
      FirebaseConfigSingleton.instance = new FirebaseConfigSingleton();
    }
    return FirebaseConfigSingleton.instance;
  }

  public getFirebaseAdminByClientId(clientId: string): admin.app.App {
    return this.config[clientId];
  }
}

export class FirebaseAuth {
  private readonly firebaseAdmin: FirebaseConfigSingleton;

  constructor() {
    this.firebaseAdmin = FirebaseConfigSingleton.getInstance();
  }

  public async signUp(clientId: string, uid: string, user: any) {
    try {
      const admin = await this.firebaseAdmin.getFirebaseAdminByClientId(clientId);
      const { email, password, firstName, lastName } = user;
      const firebaseUser = await admin.auth().updateUser(uid, {
        email,
        password,
        displayName: firstName + ' ' + lastName,
        photoURL: 'http://www.example.com/12345678/photo.png',
        // emailVerified: true,
        disabled: false,
      });
      return firebaseUser.toJSON();
    } catch (error) {
      throw new Error(OpenSykFirebaseErrorMessage.SIGN_UP_ERROR);
    }
  }

  public async validateToken(clientId: string, accessToken: string): Promise<DecodedIdToken> {
    try {
      const admin = await this.firebaseAdmin.getFirebaseAdminByClientId(clientId);
      return admin.auth().verifyIdToken(accessToken);
    } catch (error) {
      throw new Error(OpenSykFirebaseErrorMessage.INVALID_JWT_TOKEN);
    }
  }

  public async updateUser(clientId: string, uid: string, user: any) {
    try {
      const admin = await this.firebaseAdmin.getFirebaseAdminByClientId(clientId);
      const firebaseUser = await admin.auth().updateUser(uid, { ...user });
      return firebaseUser.toJSON();
    } catch (error) {
      throw new Error(OpenSykFirebaseErrorMessage.UPDATING_USER_ERROR);
    }
  }

  public async deleteUser(clientId: string, uid: string) {
    try {
      const admin = await this.firebaseAdmin.getFirebaseAdminByClientId(clientId);
      return admin.auth().deleteUser(uid);
    } catch (error) {
      throw new Error(OpenSykFirebaseErrorMessage.DELETING_USER_ERROR);
    }
  }
}
