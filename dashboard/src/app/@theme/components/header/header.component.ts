import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
declare var window : any;


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';
  currentLang;



  constructor(private sidebarService: NbSidebarService, private menuService: NbMenuService,
              private themeService: NbThemeService,private breakpointService: NbMediaBreakpointsService,
              private router : Router , private translateService : TranslateService,
              private layoutService : NbLayoutDirectionService , private dataService : DataService,
              private functionsSrvice : FunctionsService) {

  }

  ngOnInit() {
   
    //lang
    setTimeout(() => {
      this.currentLang = this.translateService.currentLang;
      this.translateService.onLangChange.subscribe((ev:LangChangeEvent) => {
        this.currentLang = ev.lang;
      })
    })
    //theming
    this.currentTheme = this.themeService.currentTheme;
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
   
  }

  changeLang(lang) {
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('lang' , lang);
    this.translateService.use(lang);
    if (lang == 'en') {
      this.layoutService.setDirection(NbLayoutDirection.LTR);
    } else {
      this.layoutService.setDirection(NbLayoutDirection.RTL);

    }
  }



  
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }



  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

 



  logout() {
    this.dataService.postData('users/logout' , {})
      .subscribe(res => {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/login');
      },err => {
        this.functionsSrvice.showToast('' , this.translateService.instant('MESSAGES.error'),'');
      });
    
  }

}
