import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChowImageComponent } from './chow-image/chow-image.component';
import { MapComponent } from './map/map/map.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChowImageComponent,
    MapComponent
  ],
  exports: [
    ChowImageComponent,
    MapComponent
  ]
})
export class SharedModule { }
