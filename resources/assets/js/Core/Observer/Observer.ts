import { Observable } from './Observable';

export interface Observer {
  update(observable: Observable): void;
}