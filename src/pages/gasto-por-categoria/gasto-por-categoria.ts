import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../services/auth.service';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';
import { Observable } from 'rxjs/Observable';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
/**
 * Generated class for the GastoPorCategoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gasto-por-categoria',
  templateUrl: 'gasto-por-categoria.html',
})
export class GastoPorCategoriaPage {

  arrayGastosDiversos = [];
  myObj = new Object();
  data;
  mes;
  ano;
  categorias = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private authService: AuthService
  ) {
    this.verificaSeExisteCategorias();
    if (this.data == undefined) {
      var d = new Date();
      var data = "";
      this.mes = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
      this.ano = d.getFullYear();
    } else {
      this.mes = this.data.substr(5, 2);
      this.ano = this.data.substr(0, 4);
    }
    this.buscaGastosPorCategoria();
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
            self.buscaGastosPorCategoria(snapshot.val().id_usuario);
          }
        });
      })
  }

  buscaGastosPorCategoria(idUsuario = null) {

    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    this.database.list(id + '/categorias/', {
      preserveSnapshot: true
    }).subscribe(snapshots => {
      var total = 0;
      snapshots.forEach(snapshot => {
        this.categorias.push(snapshot.val().descricao);
      });
    })

    this.database.list(id + '/categorias/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var categoria = snapshot.val().descricao;
          //soma gastos diversos por categoria
          this.database.list(id + '/gastos/diversos/' + this.ano + '/' + this.mes, {
            preserveSnapshot: true,
            query: {
              orderByChild: 'categoria',
              equalTo: categoria
            }
          })
            .subscribe(snapshots => {
              var total = 0;
              snapshots.forEach(snapshot => {
                this.myObj[categoria] = this.myObj[categoria] == undefined ?
                  snapshot.val().valor :
                  Number(this.myObj[categoria]) + Number(snapshot.val().valor);
              });
            })

          //soma gastos fixos por categoria
          this.database.list(id + '/gastos/fixos/' + this.ano + '/' + this.mes, {
            preserveSnapshot: true,
            query: {
              orderByChild: 'categoria',
              equalTo: categoria
            }
          })
            .subscribe(snapshots => {
              var total = 0;
              snapshots.forEach(snapshot => {
                this.myObj[categoria] = this.myObj[categoria] == undefined ? Math.ceil(snapshot.val().valor) :
                  Math.ceil(Number(this.myObj[categoria]) + Number(snapshot.val().valor));

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
                var valor = snapshot.val().valor;
                this.database.list(id + '/gastosCredito', {
                  preserveSnapshot: true,
                  query: {
                    orderByKey: id_item,
                    equalTo: id_item
                  }
                })
                  .subscribe(snapshots => {
                    snapshots.forEach(snapshot => {
                      if (categoria == snapshot.val().categoria) {
                        this.myObj[categoria] = this.myObj[categoria] == undefined
                          ? valor :
                          Number(this.myObj[categoria]) + Number(valor);
                      }
                    })
                  })

              });
            })
        });
      })
  }

}
