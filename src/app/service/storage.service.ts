import { Injectable } from '@angular/core';

const USER_KEY = 'rol';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public clean(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem(USER_KEY);
    console.log('En el strorage--> '+user);
    
    if (user) {
      return true;
    }
    return false;
  }

  public getRole() {
    return localStorage.getItem(USER_KEY);
  
  }
}
