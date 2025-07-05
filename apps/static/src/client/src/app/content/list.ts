import {Component, inject, OnInit, signal} from "@angular/core";
import {ApiService} from "../api.service";
import {Item} from "./item";
import {Content} from "../interfaces";

@Component({
  selector: 'content-list',
  templateUrl: 'list.html',
  styleUrl: 'list.scss',
  imports: [
    Item
  ]
})
export class List implements OnInit {
    api = inject(ApiService);
    content = signal<Content[]>([]);

    async ngOnInit() {
      this.content.set(await this.api.getContent());
    }
}

