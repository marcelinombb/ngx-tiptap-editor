/**
 * Portions of this code are derived from ngx-tiptap (MIT License)
 * Copyright (c) 2020-present Sibiraj <https://github.com/sibiraj-s/ngx-tiptap>
 * Adapted and maintained for ngx-tiptap-editor.
 */

import {
  ApplicationRef,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  Injector,
  Type,
  createComponent,
} from '@angular/core';

export class AngularRenderer<C, P = Record<string, any>> {
  private applicationRef: ApplicationRef;
  private componentRef: ComponentRef<C>;

  constructor(ViewComponent: Type<C>, injector: Injector, props: Partial<P>) {
    this.applicationRef = injector.get(ApplicationRef);
    const environmentInjector = injector.get(EnvironmentInjector, this.applicationRef.injector);

    this.componentRef = createComponent(ViewComponent, {
      environmentInjector,
      elementInjector: injector,
    });

    // set input props to the component
    this.updateProps(props);
    this.applicationRef.attachView(this.componentRef.hostView);
  }

  get instance(): C {
    return this.componentRef.instance;
  }

  get elementRef(): ElementRef<HTMLElement> {
    return this.componentRef.injector.get(ElementRef);
  }

  get dom(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  updateProps<T extends P>(props: Partial<T>): void {
    Object.entries(props as Record<string, unknown>).forEach(([key, value]) => {
      this.componentRef.setInput(key, value);
    });
  }

  updateAttributes(attributes: Record<string, string>): void {
    Object.keys(attributes).forEach((key) => {
      this.dom.setAttribute(key, attributes[key]);
    });
  }

  detectChanges(): void {
    this.componentRef.changeDetectorRef.detectChanges();
  }

  destroy(): void {
    this.componentRef.destroy();
    this.applicationRef.detachView(this.componentRef.hostView);
  }
}
