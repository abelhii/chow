import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChowImageComponent } from './chow-image/chow-image.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChowImageComponent
  ],
  exports: [
    ChowImageComponent
  ]
})
export class SharedModule { }
