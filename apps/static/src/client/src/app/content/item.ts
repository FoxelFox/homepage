import {Component, Input} from "@angular/core";
import {Content} from "../interfaces";

@Component({
  selector: 'item',
  templateUrl: 'item.html',
  styleUrl: 'item.scss'
})
export class Item {
  @Input() content: Content
}