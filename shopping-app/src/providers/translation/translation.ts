import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MARKET } from '../../shared/config';


@Injectable()
export class TranslationProvider {


  constructor(public translateService: TranslateService) {
    console.log('Hello TranslationProvider Provider');
  }

  //change Language
  changeLang(lang: string) {
    this.translateService.setDefaultLang(lang);
    return this.translateService.use(lang);
  }



  //get current language
  getLang(): string {
    return this.translateService.getDefaultLang();
  }

  //get translation
  translate(key: string) {
    return this.translateService.instant(key)
  }




  //get page direction
  getDirection(): string {
    let lang = this.getLang();
    return lang ? MARKET.languages.filter(language => language.code == lang)[0].direction 
      : MARKET.languages.filter(language => language.code == MARKET.defaultLang)[0].direction;
  }


}
