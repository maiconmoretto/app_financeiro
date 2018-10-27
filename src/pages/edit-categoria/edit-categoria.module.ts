import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCategoriaPage } from './edit-categoria';

@NgModule({
  declarations: [
    EditCategoriaPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCategoriaPage),
  ],
})
export class EditCategoriaPageModule {}
