import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { GestaoCreditoPage } from '../gestao-credito/gestao-credito';
import { CadastroGastoFixoPage } from '../cadastro-gasto-fixo/cadastro-gasto-fixo';
import { DetalheGastosPage } from '../detalhe-gastos/detalhe-gastos';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { AuthService } from '../../services/auth.service';
import { GestaoCompartilharPage } from '../gestao-compartilhar/gestao-compartilhar';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';
/**
 * Generated class for the RelatorioGastoPorPessoaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relatorio-gasto-por-pessoa',
  templateUrl: 'relatorio-gasto-por-pessoa.html',
})
export class RelatorioGastoPorPessoaPage {

  mes;
  ano;
  data;
  gastosPorPessoa = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private authService: AuthService) {

    if (this.data == undefined) {
      var d = new Date();
      var data = "";
      this.mes = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
      this.ano = d.getFullYear();
    } else {
      this.mes = this.data.substr(5, 2);
      this.ano = this.data.substr(0, 4);
    }
    this.somaTotalGastosPorPessoa();
    this.verificaSeExisteConvite();
    this.verificaSeExisteCompartilhamento();
  }

  verificaSeExisteCategorias() {
    this.database.list(this.authService.currentUserId + '/categorias/')
      .subscribe(data => {
        if (data.length == 0) {
          alert('Não existem categorias cadastras, é necessário cadastrar!')
          this.navCtrl.push(GestaoCategoriasPage);
        }
      })
  }

  verificaSeExisteCompartilhamento() {
    let self = this;
    this.database.list('/compartilhamento/', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'email_destinatario',
        equalTo: this.authService.getCurrentUserEmail
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().aceito == 'sim') {
            self.somaTotalGastosPorPessoa(snapshot.val().id_usuario, snapshot.val().email_remetente);
          }
        });
      })
  }

  verificaSeExisteConvite() {
    this.database.list('/compartilhamento/', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'email_destinatario',
        equalTo: this.authService.getCurrentUserEmail
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().aceito == '') {
            this.actionSheetCtrl.create({
              title: 'Olá ' + this.authService.getCurrentUserEmail + ', ' + snapshot.val().email_remetente + " quer compartilhar os gastos com você.",
              buttons: [
                {
                  text: 'Ver convite',
                  handler: () => {
                    this.navCtrl.push(GestaoCompartilharPage)
                  }
                }
              ]
            }).present();
          }
        });
      })
  }

  somaTotalGastosPorPessoa(idUsuario = null, emailUsuario = null) {
    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    let email = emailUsuario == null ? this.authService.getCurrentUserEmail : emailUsuario;
    let total = 0;
    let totalDivisivel = 0;
    let totalIndividual = 0;

    this.database.list(id + '/gastos/diversos/' + this.ano + '/' + this.mes, {
      preserveSnapshot: true,
      query: {
        orderByChild: 'data_cadastro'
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          console.log('gasto_por ' + snapshot.val().gasto_por);
          console.log('descricao ' + snapshot.val().descricao);
          console.log('valor ' + snapshot.val().valor);
          total = 0;
          totalIndividual = 0;
          totalDivisivel = 0;
          if (snapshot.val().dividir == "nao") {
            totalIndividual += Math.round(Number(snapshot.val().valor));
            total += Math.round(Number(snapshot.val().valor));
          }
          if (snapshot.val().dividir != "nao") {
            totalDivisivel += Math.round(Number(snapshot.val().valor));
            total += Math.round(Number(snapshot.val().valor));
          }
          this.calculaGastoPorPessoa(total, totalDivisivel, totalIndividual, email, id);
        });
      })


    this.database.list(id + '/gastosFixos/', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'data_cadastro'
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {

          console.log('gasto_por ' + snapshot.val().gasto_por);
          console.log('descricao ' + snapshot.val().descricao);
          console.log('valor ' + snapshot.val().valor);
          total = 0;
          totalIndividual = 0;
          totalDivisivel = 0;
          if (snapshot.val().dividir == "nao") {
            totalIndividual += Math.round(Number(snapshot.val().valor));
            total += Math.round(Number(snapshot.val().valor));
          }
          if (snapshot.val().dividir != "nao") {
            totalDivisivel += Math.round(Number(snapshot.val().valor));
            total += Math.round(Number(snapshot.val().valor));
          }
          this.calculaGastoPorPessoa(total, totalDivisivel, totalIndividual, email, id);
        });
      })


    this.database.list(id + '/prestacoes_credito', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'mes_e_ano',
        equalTo: this.mes + '/' + this.ano
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var id_item = snapshot.val().id_item;
          var valor_prestacao = Number(snapshot.val().valor);
          var roundedString = valor_prestacao.toFixed(2);
          var rounded = Number(roundedString);
          var parcela = snapshot.val().parcela;
          this.database.list(id + '/gastosCredito', {
            preserveSnapshot: true,
            query: {
              orderByKey: id_item,
              equalTo: id_item
            }
          })
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {

                console.log('gasto_por ' + snapshot.val().gasto_por);
                console.log('descricao ' + snapshot.val().descricao);
                console.log('parcela ' + rounded);
                total = 0;
                totalIndividual = 0;
                totalDivisivel = 0;
                if (snapshot.val().dividir == "nao") {
                  total += Math.round(Number(rounded));
                  totalIndividual += Math.round(Number(rounded));
                }
                if (snapshot.val().dividir != "nao") {
                  totalDivisivel += Math.round(Number(rounded));
                  total += Math.round(Number(rounded));
                }
                this.calculaGastoPorPessoa(total, totalDivisivel, totalIndividual, email, id);
              })
            })
        });
      })

  }

  calculaGastoPorPessoa(total, totalDivisivel, totalIndividual, email, id) {

    if (this.gastosPorPessoa.length == 0) {
      this.gastosPorPessoa.push({
        id: id,
        email: email,
        total: total,
        totalDivisivel: totalDivisivel,
        totalIndividual: totalIndividual,
      });
      return;
    } else {
      var found = false;
      for (var i = 0; i < this.gastosPorPessoa.length; i++) {
        if (this.gastosPorPessoa[i].email == email) {
          let novoTotal = Number(this.gastosPorPessoa[i].total) + Number(total);
          let novoTotalIndividual = Number(this.gastosPorPessoa[i].totalIndividual) + Number(totalIndividual);
          let novoTotalDivisivel = Number(this.gastosPorPessoa[i].totalDivisivel) + Number(totalDivisivel);
          var index = this.gastosPorPessoa.indexOf(this.gastosPorPessoa[i]);
          if (index > -1) {
            this.gastosPorPessoa.splice(index, 1);
          }
          this.gastosPorPessoa.push({
            id: id,
            email: email,
            total: novoTotal,
            totalDivisivel: novoTotalDivisivel,
            totalIndividual: novoTotalIndividual,
          });
          return;
        }
      }
    }
    this.gastosPorPessoa.push({
      id: id,
      email: email,
      total: total,
      totalDivisivel: totalDivisivel,
      totalIndividual: totalIndividual,
    });
  }
}
