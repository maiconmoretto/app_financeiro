import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

	private isLoggedIn;

	constructor(private afAuth: AngularFireAuth) { }

	logout(): void {
		this.isLoggedIn = false;
		this.afAuth.auth.signOut;
	}

	authenticated(): boolean {
		this.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				this.isLoggedIn = true;
			} else {
				this.isLoggedIn = true;
			}
		});
		return this.isLoggedIn;
	}

	getCurrentUserId() {
		this.afAuth.authState.subscribe(data => {
		  return data.uid;
		});
	  }
	  
	getCurrentUserEmail() {
		this.afAuth.authState.subscribe(data => {
		  return data.email;
		});
	  }
	
}