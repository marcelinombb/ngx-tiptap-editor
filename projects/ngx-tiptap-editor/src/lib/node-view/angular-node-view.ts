/**
 * Portions of this code are derived from ngx-tiptap (MIT License)
 * Copyright (c) 2020-present Sibiraj <https://github.com/sibiraj-s/ngx-tiptap>
 * Adapted and maintained for ngx-tiptap-editor.
 */

import { Type } from '@angular/core';
import { getRenderedAttributes, NodeView } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { Decoration, DecorationSource } from '@tiptap/pm/view';
import { AngularNodeViewComponent } from './angular-node-view.component';
import { AngularNodeViewRendererOptions } from './angular-node-view-renderer';
import { AngularRenderer } from './angular-renderer';

export class AngularNodeView extends NodeView<
  Type<AngularNodeViewComponent>,
  any,
  AngularNodeViewRendererOptions
> {
  // Use `declare` so TypeScript with useDefineForClassFields does not emit
  // `this.renderer = void 0` after super() returns, which would wipe out what mount() initializes.
  declare renderer: AngularRenderer<AngularNodeViewComponent>;
  declare contentDOMElement: HTMLElement | null;

  override mount(): void {
    const injector = this.options.injector;

    const props = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: false,
      extension: this.extension,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode(),
    };

    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);

    // create renderer
    this.renderer = new AngularRenderer(this.component, injector, props);

    // Register drag handler
    if (this.extension.config.draggable) {
      this.renderer.elementRef.nativeElement.ondragstart = (e: DragEvent) => {
        this.onDragStart(e);
      };
    }

    if (this.node.isLeaf) {
      this.contentDOMElement = null;
    } else if (this.options.contentDOMElementTag) {
      this.contentDOMElement = document.createElement(this.options.contentDOMElementTag);
    } else {
      this.contentDOMElement = document.createElement(this.node.isInline ? 'span' : 'div');
    }

    if (this.contentDOMElement) {
      this.contentDOMElement.dataset['nodeViewContentAngular'] = '';
      // Inherit whiteSpace properly across browsers
      this.contentDOMElement.style.whiteSpace = 'inherit';
      // Required for editable node views
      this.renderer.detectChanges();
    }

    this.appendContentDom();
    this.editor.on('selectionUpdate', this.handleSelectionUpdate);
    this.updateElementAttributes();
  }

  override get dom(): HTMLElement {
    return this.renderer.dom;
  }

  override get contentDOM(): HTMLElement | null {
    if (this.node.isLeaf) {
      return null;
    }
    return this.contentDOMElement;
  }

  private appendContentDom(): void {
    const contentElement = this.dom.querySelector('[data-node-view-content]');
    if (
      this.contentDOMElement &&
      contentElement &&
      !contentElement.contains(this.contentDOMElement)
    ) {
      contentElement.appendChild(this.contentDOMElement);
    }
  }

  private handleSelectionUpdate(): void {
    const { from, to } = this.editor.state.selection;
    const pos = this.getPos();

    if (typeof pos !== 'number') {
      return;
    }

    if (from <= pos && to >= pos + this.node.nodeSize) {
      if (this.renderer.instance.selected()) {
        return;
      }
      this.selectNode();
    } else {
      if (!this.renderer.instance.selected()) {
        return;
      }
      this.deselectNode();
    }
  }

  update(
    node: ProseMirrorNode,
    decorations: readonly Decoration[],
    innerDecorations: DecorationSource,
  ): boolean {
    const updateProps = (props: Record<string, any>) => {
      this.renderer.updateProps(props);
      if (typeof this.options.attrs === 'function') {
        this.updateElementAttributes();
      }
    };

    if (this.options.update) {
      const oldNode = this.node;
      const oldDecorations = this.decorations;
      const oldInnerDecorations = this.innerDecorations;

      this.node = node;
      this.decorations = decorations as any;
      this.innerDecorations = innerDecorations;

      return this.options.update({
        oldNode,
        oldDecorations,
        oldInnerDecorations,
        newNode: node,
        newDecorations: decorations,
        innerDecorations: this.innerDecorations,
        updateProps: () =>
          updateProps({
            node,
            decorations,
            innerDecorations,
          }),
      });
    }

    if (node.type !== this.node.type) {
      return false;
    }

    if (
      node === this.node &&
      this.decorations === decorations &&
      this.innerDecorations === innerDecorations
    ) {
      return true;
    }

    this.node = node;
    this.decorations = decorations as any;
    this.innerDecorations = innerDecorations;

    updateProps({
      node,
      decorations,
      innerDecorations,
    });

    return true;
  }

  selectNode(): void {
    this.renderer.updateProps({ selected: true });
    this.renderer.dom.classList.add('ProseMirror-selectednode');
  }

  deselectNode(): void {
    this.renderer.updateProps({ selected: false });
    this.renderer.dom.classList.remove('ProseMirror-selectednode');
  }

  destroy(): void {
    this.renderer.destroy();
    this.editor.off('selectionUpdate', this.handleSelectionUpdate);
    this.contentDOMElement = null;
  }

  private updateElementAttributes(): void {
    if (this.options.attrs) {
      let attrsObj: Record<string, string> = {};

      if (typeof this.options.attrs === 'function') {
        const extensionAttributes = this.editor.extensionManager.attributes;
        const HTMLAttributes = getRenderedAttributes(this.node, extensionAttributes);
        attrsObj = this.options.attrs({ node: this.node, HTMLAttributes });
      } else {
        attrsObj = this.options.attrs;
      }

      this.renderer.updateAttributes(attrsObj);
    }
  }
}
