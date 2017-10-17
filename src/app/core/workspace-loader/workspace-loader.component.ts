import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-workspace-loader',
  templateUrl: './workspace-loader.component.html',
  styleUrls: ['./workspace-loader.component.css']
})
export class WorkspaceLoaderComponent implements OnInit {
  @Input() wutzModules;
  @Input() appStorage;

  constructor() { }

  ngOnInit() {
  }

}
