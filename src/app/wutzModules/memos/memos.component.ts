import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memos',
  templateUrl: './memos.component.html',
  styleUrls: ['./memos.component.css']
})
export class MemosComponent implements OnInit {
  memos;

  constructor() {
    this.memos = [
      {
        name: "Pasta recipe",
        fileName: "pasta_recipe.txt"
      },
      {
        name: "Passwords",
        fileName: "passwords.txt"
      },
      {
        name: "Ninja Manual",
        fileName: "ninja_manual.txt"
      },
      {
        name: "Pasta recipe",
        fileName: "pasta_recipe.txt"
      },
      {
        name: "Passwords",
        fileName: "passwords.txt"
      },
      {
        name: "Ninja Manual",
        fileName: "ninja_manual.txt"
      }
    ]
  }

  ngOnInit() {
  }

}
