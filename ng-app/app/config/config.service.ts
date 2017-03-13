import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../app.config';
import * as _ from 'lodash';

@Injectable()
export class ConfigService {

  constructor(@Inject(APP_CONFIG) private config: IAppConfig) {
    //
  }

  public get(key: string, defaultValue?: any): any {
    return _.get(this.config, key, defaultValue);
  }

}
