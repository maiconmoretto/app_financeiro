import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditConvitePage } from './edit-convite';

@NgModule({
  declarations: [
    EditConvitePage,
  ],
  imports: [
    IonicPageModule.forChild(EditConvitePage),
  ],
})
export class EditConvitePageModule {}
