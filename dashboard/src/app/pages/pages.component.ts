import { Component } from '@angular/core';
import { FunctionsService } from '../services/functions/functions.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NbMenuItem } from '@nebular/theme';
import { Socket } from 'ngx-socket-io';
import { Howl } from "howler";


@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu : NbMenuItem[];

  constructor(private functionsService : FunctionsService , private translateService : TranslateService ,
    private socket : Socket) {
    this.getMenu();
    this.onNewOrder();
  }


  

  getMenu() {
    let lang = this.translateService.currentLang;
    this.menu = this.functionsService.getMENU(lang);
    this.translateService.onLangChange.subscribe((ev : LangChangeEvent) => {
      this.menu = this.functionsService.getMENU(ev.lang);
    })
  }

  //new order
  onNewOrder() {
    this.socket.fromEvent('orders')
      .subscribe(res => {
        this.playSound();
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.newOrder') , '');
      })
  }

  playSound() {
    var sound = new Howl({
      src: ['../../assets/sound/inflicted.mp3']
    });
    
    sound.play();
  }
}
