import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

  private isLoggedIn;

  authState: any = null;
  constructor(private afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
  }

  logout(): void {
    this.afAuth.auth.signOut();
    this.isLoggedIn = false;
    this.afAuth.auth.signOut;
  }

  authenticated(): boolean {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
    return this.isLoggedIn;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }
  get getCurrentUserEmail(): string {
    return this.authenticated ? this.authState.email : '';
  }
}