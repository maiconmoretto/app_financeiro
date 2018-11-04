import { Component } from '@angular/core';
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

	splash = true;

	constructor(
		private navCtrl: NavController,
		private afAuth: AngularFireAuth,
		private authService: AuthService,
		private alertController: AlertController,
		private menuController: MenuController,
		private toastCtrl: ToastController
	) {

	}


	ionViewWillEnter() {
		let self = this;
		this.menuController.swipeEnable(false)
		this.afAuth.auth.onAuthStateChanged(function (user) {
			if (user) {
				self.navCtrl.push(ResumoGastosPage);
			}
		});

	}

	ionViewDidLeave() {
		//this.menuController.swipeEnable(true)
	}

	isAuthenticated() {
		return this.authService.authenticated();
	}

	ionViewDidLoad() {
		setTimeout(() => this.splash = false, 4000);
	}

	async  login(user: User) {
		if (user.email == undefined || user.password == undefined) {
			let toast = this.toastCtrl.create({
				message: 'Digite os campos email e senha!',
				duration: 3000,
				position: 'top'
			});

			toast.onDidDismiss(() => {
			});

			toast.present();

		} else {
			var self = this;
			this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(function () {
				self.navCtrl.push(ResumoGastosPage);
				console.log('sucesso');
			}).catch(function (error) {
				var errorMessage = error.message;
				let message = '';

				if (errorMessage == 'The email address is badly formatted.') {
					message = 'O email está formatado de maneira incorreta.'
				} else if (errorMessage == 'Password should be at least 6 characters') {
					message = 'A senha deve ter pelo menos 6 caracteres.'
				} else if (errorMessage == 'The password must be 6 characters long or more.') {
					message = 'A senha deve ter pelo menos 6 caracteres ou mais.'
				} else if (errorMessage == 'The email address is already in use by another account.') {
					message = 'O endereço de email já está sendo usado por outra conta.'
				} else {
					message = errorMessage
				}
				let toast = self.toastCtrl.create({
					message: message,
					duration: 3000,
					position: 'top'
				});
				toast.present();
			});
		}
	}


	register() {
		this.navCtrl.push('RegisterPage');
	}

}