import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ApiService} from "./api.service";
import {HttpClient, HttpHandler, provideHttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  providers: [
    ApiService,
  ],
  templateUrl: 'app.html',
  styles: [],
})
export class App {
  protected title = 'client';
  n = 0;
}
