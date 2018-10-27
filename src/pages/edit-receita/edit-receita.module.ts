import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditReceitaPage } from './edit-receita';

@NgModule({
  declarations: [
    EditReceitaPage,
  ],
  imports: [
    IonicPageModule.forChild(EditReceitaPage),
  ],
})
export class EditReceitaPageModule {}
