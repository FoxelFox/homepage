import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Content } from "./interfaces";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ApiService {
  http = inject(HttpClient);

  async getContent() {
    const list = await lastValueFrom(this.http.get<Content[]>("/api/demos"));
    list.sort((a, b) => Number(!!b.meta) - Number(!!a.meta));
    return list;
  }
}
