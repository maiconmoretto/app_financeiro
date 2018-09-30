import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController, MenuController } from 'ionic-angular';
import { ResumoGastosPage } from '../resumo-gastos/resumo-gastos';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
// @IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	user = {} as User;

	constructor(
		private navCtrl: NavController,
		private afAuth: AngularFireAuth,
		private authService: AuthService,
		private alertController: AlertController,
		private menuController: MenuController,
		private toastCtrl: ToastController
	) {

		this.validateIsAuthenticaded();

	}

	validateIsAuthenticaded() {

	}

	ionViewWillEnter() {

		this.menuController.swipeEnable(false)
	}

	ionViewDidLeave() {

		this.menuController.swipeEnable(true)
	}

	isAuthenticated() {
		return this.authService.authenticated();
	}
	async  login(user: User) {
		var erro = false;
		const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
			.catch(function (error) {
				erro = true;
				var errorMessage = error.message;
				alert(errorMessage);
				console.log(error);
				return false;
			});
		console.log(result);
		if ('1' == '2') {
			this.navCtrl.setRoot(ResumoGastosPage);
		}

	}


	register() {
		this.navCtrl.push('RegisterPage');
	}

}