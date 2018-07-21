import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { ResumoGastosPage } from '../resumo-gastos/resumo-gastos';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

// @IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	user = {} as User;

	constructor(
		private navCtrl: NavController,
		private afAuth: AngularFireAuth
	) {

	}

	async  login(user: User) {
		try {
			const result =  this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
			this.navCtrl.push(ResumoGastosPage);
			console.log(result);
		} catch (e) {
			console.error(e);
		}
	}

	register() {
		this.navCtrl.push('RegisterPage');
	}

}