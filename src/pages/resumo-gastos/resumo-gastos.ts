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

@Component({
  selector: 'page-resumo-gastos',
  templateUrl: 'resumo-gastos.html',
})
export class ResumoGastosPage {

  shoppingListRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosFixosRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosCreditoRef$: FirebaseListObservable<ShoppingItem[]>;
  saldoMes = 0;
  data;
  gastoMes = 0;
  gastoFixo = 0;;
  gastosCredito = 0;
  gastosDiversos = 0;
  restante = 0;
  arrayGastoCredito = [];
  mes;
  ano;
  stringMes;
  totalCredito = 0;
  totalDiversos = 0;
  totalFixos = 0;
  listaMaioresGastos = [];
  uid = [];
  authState: any = null;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private authService: AuthService
  ) {
    this.data = this.navParams.data.obj;
    if (this.data == undefined) {
      var d = new Date();
      var data = "";
      this.mes = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
      this.ano = d.getFullYear();
    } else {
      this.mes = this.data.substr(5, 2);
      this.ano = this.data.substr(0, 4);
    }
    this.buscaMes();
    this.somaTotalReceita();
    this.somaTotalGastos();
    this.buscaGastos();
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: 'Bem vindo ' + data.email,
          duration: 3000,
          position: 'top'
        }).present();
      } else {
        this.toast.create({
          message: 'Não foi possivel encontrar detalhes da autenticação!',
          duration: 3000,
          position: 'top'
        }).present();
        return false;
      }
    });
  }


  ionViewCanEnter() {
    return this.authService.authenticated();
  }


  somaTotalReceita() {
    this.database.list(this.authService.currentUserId+'/receita/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          if (snapshot.val().ano == this.ano && snapshot.val().mes == this.mes) {
            total += Number(snapshot.val().valor);
          }
        });
        this.saldoMes = total;
      })
  }

  buscaGastos() {
    this.shoppingListRef$ = this.database.list(this.authService.currentUserId+'/gastos/diversos/' + this.ano + '/' + this.mes);
    this.gastosFixosRef$ = this.database.list(this.authService.currentUserId+'/gastos/fixos/' + this.ano + '/' + this.mes);
  }


  somaTotalGastos() {
    this.totalDiversos = 0;
    this.totalFixos = 0;
    this.totalCredito = 0;
    var total = 0;
    this.database.list(this.authService.currentUserId+'/gastos/diversos/' + this.ano + '/' + this.mes, {
      preserveSnapshot: true,
      query: {
        orderByChild: 'data_cadastro'
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {          
          this.adicionaGastos(snapshot.val());
          this.totalDiversos += Math.round(Number(snapshot.val().valor));
          this.gastoMes = Math.round(
            Number(this.totalFixos) +
            Number(this.totalDiversos) +
            Number(this.totalCredito)
          );
          this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
        });
      })


    this.database.list(this.authService.currentUserId+'/gastos/fixos/' + this.ano + '/' + this.mes, {
      preserveSnapshot: true,
      query: {
        orderByChild: 'data_cadastro'
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.adicionaGastos(snapshot.val());
          this.totalFixos += Math.round(Number(snapshot.val().valor));
          this.gastoMes = Math.round(
            Number(this.totalFixos) +
            Number(this.totalDiversos) +
            Number(this.totalCredito)
          );
          this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
          this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
        });
      })


    this.database.list(this.authService.currentUserId+'/prestacoes_credito', {
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
          this.database.list(this.authService.currentUserId+'/gastosCredito', {
            preserveSnapshot: true,
            query: {
              orderByKey: id_item,
              equalTo: id_item
            }
          })
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                var gasto_por = snapshot.val().gasto_por;
                var dividir = snapshot.val().dividir;
                this.totalCredito += (Number(rounded));
                this.adicionaGastos(snapshot.val());
                this.gastoMes = Math.round(
                  Number(this.totalFixos) +
                  Number(this.totalDiversos) +
                  Number(this.totalCredito)
                );
                this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
              })
            })


        });
      })

  }


  adicionaGastos($gasto) {
    this.listaMaioresGastos.push(
      {
        "valor": $gasto.valor,
        "descricao": $gasto.descricao,
      }
    );
    this.listaMaioresGastos.sort(sortFunction);
    function sortFunction(a, b) {
      if (Math.round(a["valor"]) === Math.round(b["valor"])) {
        return 0;
      }
      else {
        return (Math.round(a["valor"]) < Math.round(b["valor"])) ? 1 : -1;
      }
    }
    if (this.listaMaioresGastos.length > 4) {
      this.listaMaioresGastos.length = 5;
    }


  }



  verDetalhes() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(DetalheGastosPage);
  }
  navigateToaddShoppingPage(page) {

    //navigagte  the user to AddShoppingPage
    if (page == 'credito') {
      this.navCtrl.push(GestaoCreditoPage);
    } else if (page == 'fixos') {
      this.navCtrl.push(CadastroGastoFixoPage);
    } else {
      this.navCtrl.push(AddShoppingPage);
    }
  }

  vaiParaMes(vaiPara) {
    var d = new Date();
    var mes;
    var ano;
    var data;

    if (vaiPara == 'proximo') {
      if (d.getMonth() == 12) {
        mes = '01';
        ano = (d.getFullYear() + 2);
        data = ano + '-' + mes;
      } else {
        mes = (d.getMonth() + 2) < 10 ? '0' + (d.getMonth() + 2) : (d.getMonth() + 2);
        ano = d.getFullYear();
        data = ano + '-' + mes;
      }
    } else {
      if (d.getMonth() == 2) {
        mes = '12';
        ano = (d.getFullYear() - 1);
        data = ano + '-' + mes;
      } else {
        mes = (d.getMonth() - 1) < 10 ? '0' + (d.getMonth() - 1) : (d.getMonth() - 1);
        ano = d.getFullYear();
        data = ano + '-' + mes;
      }
    }

    this.navCtrl.push(DetalheGastosPage, { obj: data });

  }

  buscaMes() {
    var date = new Date( this.mes.toString()),
      locale = "pt-br",
      month = date.toLocaleString(locale, { month: "short" });
    this.stringMes = month;
  }



}