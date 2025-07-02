import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Content} from "./interfaces";
import {lastValueFrom} from "rxjs";

@Injectable()
export class ApiService {

  http = inject(HttpClient);

  async getContent() {
    return lastValueFrom(this.http.get<Content[]>('/api/demos'));
  }
}
