import { Component, signal } from '@angular/core';
import { NgxTiptapEditor } from 'ngx-tiptap-editor';


@Component({
  selector: 'app-root',
  imports: [NgxTiptapEditor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  onContentChange($event: string) {
    console.log('Content changed:', $event);
  }
  protected readonly title = signal('my-workspace');
}
