import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { EditShoppingItemPage } from '../edit-shopping-item/edit-shopping-item';



@IonicPage()
@Component({
  selector: 'page-detalhe-gastos',
  templateUrl: 'detalhe-gastos.html',
})

export class DetalheGastosPage {

  // arrayGastosDiversos$: FirebaseListObservable<ShoppingItem[]>;
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


  arrayGastoPorCategorias = [];
  categorias = [];
  supermercado;
  lazer;
  conexao;
  transporte;
  farmacia;
  casa;
  educacao;
  poupanca;
  bem_estar;
  outros;
  mes;
  ano;
  stringMes;

  //divisao
  totalDivididoMaicon = 0;
  totalMaicon = 0;
  gastosDivisiveisMaicon = 0;
  gastosIndividuaisMaicon = 0;
  gastosTotaisMaicon = 0;

  totalBruna = 0;
  gastosDivisiveisBruna = 0;
  gastosIndividuaisBruna = 0;
  gastosTotaisBruna = 0;
  totalDivididoBruna = 0;

  totalCredito = 0;
  totalDiversos = 0;
  totalFixos = 0;

  statusDiversos;
  statusCredito;
  statusFixos;
  statusCategorias;
  statusPorPessoa;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private authService: AuthService) {
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
    this.verificaSeExisteCompartilhamento();
  }

  ionViewCanEnter() {
    return this.authService.authenticated();
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
            console.log('aqui ' + snapshot.val().id_usuario);
            self.somaTotalReceita(snapshot.val().id_usuario);
            self.somaTotalGastos(snapshot.val().id_usuario);
            self.buscaGastos(snapshot.val().id_usuario);
          }
        });
      })
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
        this.saldoMes = total;
      })
  }

  buscaGastos(idUsuario = null) {
    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    this.database.list(id + '/gastos/diversos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          this.arrayGastosDiversos.push(snapshot.val())
        })
      })

    this.database.list(id + '/gastosFixos/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          this.arrayGastosFixos.push(snapshot.val())
        })
      })

  }

  somaTotalGastos(idUsuario = null) {
    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    var total = 0;
    this.database.list(id + '/gastos/diversos/' + this.ano + '/' + this.mes, {
      preserveSnapshot: true,
      query: {
        orderByChild: 'data_cadastro'
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.totalDiversos += Math.round(Number(snapshot.val().valor));
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
          this.totalFixos += Math.round(Number(snapshot.val().valor));
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
                this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
              })
            })
        });
      })
  }


  buscaMes() {
    var date = new Date(this.mes.toString()),
      locale = "pt-br",
      month = date.toLocaleString(locale, { month: "short" });
    this.stringMes = month;
  }

  hideShowDiversos() {
    this.statusDiversos = this.statusDiversos == true ? false : true;
  }
  hideShowCredito() {
    this.statusCredito = this.statusCredito == true ? false : true;
  }
  hideShowFixos() {
    this.statusFixos = this.statusFixos == true ? false : true;
  }

}


