import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
import { ResumoGastosPage } from '../resumo-gastos/resumo-gastos';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    private afAuth: AngularFireAuth) {
  }

  async register(user: User) {
    try {
      var self = this;
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(function () {
        alert('usuário cadastrado');
        self.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(function () {
          self.navCtrl.push(ResumoGastosPage);
          console.log('sucesso');
        }).catch(function (error) {
          var errorMessage = error.message;
          alert(errorMessage);
          console.log('erro');
        });
      }).catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });


      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }

}
