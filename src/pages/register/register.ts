import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
import { LoginPage } from '../login/login';
import { ToastController } from 'ionic-angular'; 


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
		private menuController: MenuController) {
  }

  async register(user: User) {
    if (user.email == undefined || user.password == undefined) {
      let toast = this.toastCtrl.create({
        message: 'Digite os campos email e senha!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    try {
      let self = this;
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(function () {
        alert('Usuário cadastrado!');
        // self.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(function () {
        // })
      }).catch(function (error) {
        let errorMessage = error.message;
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
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }

  voltar() {
    this.navCtrl.push(LoginPage);
  }
 
  ionViewWillEnter() {
    this.menuController.swipeEnable(false)
  }

  ionViewDidLeave() {
    //this.menuController.swipeEnable(true)
  }

}
