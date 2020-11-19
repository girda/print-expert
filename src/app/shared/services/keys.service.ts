import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeysService {
  roles = {
    admin: {
      id: 1,
      name: 'Адміністратор'
    },
    user: {
      id: 0,
      name: 'Користувач'
    },
    client: {
      id: 2,
      name: 'Клієнт'
    }
  };
}