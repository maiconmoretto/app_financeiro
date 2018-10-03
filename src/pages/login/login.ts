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
		var self = this;
		this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(function () {
			self.navCtrl.push(ResumoGastosPage);
			// this.navCtrl.setRoot(ResumoGastosPage);
			// console.log('aqui '+ this.authService.authenticated());
			console.log('sucesso');
		}).catch(function (error) {
			// var errorCode = error.code;
			var errorMessage = error.message;
			alert(errorMessage);
			console.log('erro');
			// this.authService.logout();
			// this.navCtrl.push(LoginPage);
		});


	}

	register() {
		this.navCtrl.push('RegisterPage');
	}

}