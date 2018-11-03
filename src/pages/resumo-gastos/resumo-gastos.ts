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

@Component({
  selector: 'page-resumo-gastos',
  templateUrl: 'resumo-gastos.html',
})
export class ResumoGastosPage {

  arrayGastosDiversos = [];
  arrayGastosFixos = [];
  arrayGastoCredito = [];
  saldoMes = 0;
  data;
  gastoMes = 0;
  gastoFixo = 0;;
  gastosCredito = 0;
  gastosDiversos = 0;
  restante = 0;
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
    this.verificaSeExisteCategorias();
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
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
            self.somaTotalReceita(snapshot.val().id_usuario);
            self.somaTotalGastos(snapshot.val().id_usuario);
            self.buscaGastos(snapshot.val().id_usuario);
          }
        });
      })
  }

  verificaSeExisteConvite() {
    let achou = false;
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
            achou == true;
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
          if (achou == true){
            return false;
          }
        });
      })
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


  somaTotalReceita(idUsuario = null) {
    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    this.database.list(id + '/receita/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          if (snapshot.val().ano == this.ano && snapshot.val().mes == this.mes) {
            total += Number(snapshot.val().valor);
          }
        });
        this.saldoMes += total;
      })
  }

  buscaGastos(idUsuario = null) {
    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    this.database.list(id + '/gastos/diversos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.arrayGastosDiversos.push(snapshot.val())
        })
      })

    this.database.list(id + '/gastosFixos/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.arrayGastosFixos.push(snapshot.val())
        })
      })
  }

  somaTotalGastos(idUsuario = null) {
    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    let total = 0;
    this.database.list(id + '/gastos/diversos/' + this.ano + '/' + this.mes, {
      preserveSnapshot: true,
      query: {
        orderByChild: 'data_cadastro'
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.adicionaGastos(snapshot.val().valor, snapshot.val().descricao);
          this.totalDiversos += Math.round(Number(snapshot.val().valor));
          this.gastoMes = Math.round(
            Number(this.totalFixos) +
            Number(this.totalDiversos) +
            Number(this.totalCredito)
          );
          this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
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
          this.adicionaGastos(snapshot.val().valor, snapshot.val().descricao);
          this.totalFixos += Math.round(Number(snapshot.val().valor));
          this.gastoMes = Math.round(
            Number(this.totalFixos) +
            Number(this.totalDiversos) +
            Number(this.totalCredito)
          );
          this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
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
                var gasto_por = snapshot.val().gasto_por;
                var dividir = snapshot.val().dividir;
                this.totalCredito += Math.round(Number(rounded));
                this.gastoMes = Math.round(
                  Number(this.totalFixos) +
                  Number(this.totalDiversos) +
                  Number(this.totalCredito)
                );
                this.arrayGastoCredito.push({
                  descricao: snapshot.val().descricao,
                  categoria: snapshot.val().categoria,
                  gasto_por: snapshot.val().gasto_por,
                  valor: rounded,
                  parcela: parcela,
                  dividir: snapshot.val().dividir
                });
                this.adicionaGastos(rounded, snapshot.val().descricao);
                this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
              })
            })
        });
      })
  }


  adicionaGastos(descricao, valor) {
    this.listaMaioresGastos.push(
      {
        "valor": valor,
        "descricao": descricao,
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
        ano = (d.getFullYear() + 1);
        data = ano + '-' + mes;
      } else {
        mes = (d.getMonth() + 2);
        ano = d.getFullYear();
        data = ano + '-' + mes;
      }
    } else {
      if (d.getMonth() == 2) {
        mes = '12';
        ano = (d.getFullYear() - 1);
        data = ano + '-' + mes;
      } else {
        mes = (d.getMonth());
        ano = d.getFullYear();
        data = ano + '-' + mes;
      }
    }
    this.navCtrl.push(DetalheGastosPage, { obj: data });
  }

  buscaMes() {
    var date = new Date(this.mes.toString()),
      locale = "pt-br",
      month = date.toLocaleString(locale, { month: "short" });
    this.stringMes = month;
  }



}