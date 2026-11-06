import { Component, signal, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Editor } from '@tiptap/core';
import { NgxTiptapEditor, ImageProxyBuilders } from 'ngx-tiptap-editor';

@Component({
  selector: 'app-root',
  imports: [NgxTiptapEditor],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private sanitizer = inject(DomSanitizer);
  htmlContent = signal<SafeHtml>('');
  defaultText = signal<string>('');

  extensionsConfig = {
    spellChecker: {
      apiUrl: 'https://spell-checker-function-15207959809.us-east4.run.app/check',
    },
    image: {
      proxyUrl: ImageProxyBuilders.queryParam(
        'http://localhost:8080/api/v1/proxy/images',
        'encodedUrl',
      ),
    },
  };

  onEditorReady($event: Editor) {
    // @ts-expect-error - debugging window assignment
    window.editor = $event;
    //console.log('Editor pronto', $event.getJSON());
  }

  onContentChange($event: string) {
    //console.log($event);
    localStorage.setItem('defaultText', $event);
    this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml($event));
  }

  ngOnInit() {
    if (localStorage.getItem('defaultText')) {
      this.defaultText.set(localStorage.getItem('defaultText')!);
    } else {
      this.defaultText.set(
        `<div class="tableWrapper" style="width: 47.7%;"><table style="width: 100%; table-layout: fixed;"><colgroup><col style="width: 7.24%;"><col style="width: 7.24%;"><col style="width: 85.52%;"></colgroup><tbody><tr><td colspan="1" rowspan="1" colwidth="7.24"><p style="margin-left: 0px !important;"><br></p></td><td colspan="1" rowspan="1" colwidth="7.24"><p style="margin-left: 0px !important;"><br></p></td><td colspan="1" rowspan="1" colwidth="85.52"><p style="margin-left: 0px !important;"><br></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="7.24"><p style="margin-left: 0px !important;"><br></p></td><td colspan="1" rowspan="1" colwidth="7.24"><p style="margin-left: 0px !important;"><br></p></td><td colspan="1" rowspan="1" colwidth="85.52"><p style="margin-left: 0px !important;"><br></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="7.24"><p style="margin-left: 0px !important;"><br></p></td><td colspan="1" rowspan="1" colwidth="7.24"><p style="margin-left: 0px !important;"><br></p></td><td colspan="1" rowspan="1" colwidth="85.52"><p style="margin-left: 0px !important;"><br></p></td></tr></tbody></table></div>`,
      );
    }
    this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(this.defaultText()));
  }
}
