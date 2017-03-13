import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from './config.service';

@Pipe({
  name: 'config'
})
export class ConfigPipe implements PipeTransform {

  constructor(private configService: ConfigService) {
    //
  }

  public transform(value: string): any {
    return this.configService.get(value);
  }

}
