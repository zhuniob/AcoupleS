import { Component, OnInit, Renderer2 } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isOnline$: Observable<boolean>;
  title = 'SystemAnimalCoupF';
  public netStatus: String;
  visibleSidebar1: any;

  constructor(private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.netStatus = 'online'; // Valor por defecto
    fromEvent(window, 'offline')
      .pipe(debounceTime(100))
      .subscribe((event: Event) => {
        console.log(event);
        this.netStatus = event.type;
        console.log('-> '+this.netStatus);
      });

    fromEvent(window, 'online')
      .pipe(debounceTime(100))
      .subscribe((event: Event) => {
        console.log(event);
        this.netStatus = event.type;
        console.log('-> '+this.netStatus);
      });

  }

  public reloadPage() {
    location.reload();
  }
}
