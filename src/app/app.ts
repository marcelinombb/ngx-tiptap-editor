import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxNgxTiptapEditor } from 'ngx-tiptap-editor';

@Component({
  selector: 'app-root',
  imports: [NgxNgxTiptapEditor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-workspace');
}
