import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import {LoginPage} from '../login/login';
/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService) {
  }

  ionViewDidLoad(user: User) {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    this.authService.logout();
    this.navCtrl.push(LoginPage);
  }


}
