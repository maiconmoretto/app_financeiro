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
		console.log('ionViewWillEnter')
		let self = this;
		this.menuController.swipeEnable(false)
		this.afAuth.auth.onAuthStateChanged(function (user) {
			if (user) {
				self.navCtrl.push(ResumoGastosPage);
			}
		});

	}

	ionViewDidLeave() {
		this.menuController.swipeEnable(true)
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
				alert(errorMessage);
				console.log('erro');
			});
		}
	}


	register() {
		this.navCtrl.push('RegisterPage');
	}

}