/**
 * Portions of this code are derived from ngx-tiptap (MIT License)
 * Copyright (c) 2020-present Sibiraj <https://github.com/sibiraj-s/ngx-tiptap>
 * Adapted and maintained for ngx-tiptap-editor.
 */

import { Injector, Type } from '@angular/core';
import type { NodeViewRenderer, NodeViewRendererOptions } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { Decoration, DecorationSource } from '@tiptap/pm/view';
import { AngularNodeViewComponent } from './angular-node-view.component';
import { AngularNodeView } from './angular-node-view';

export interface RendererUpdateProps {
  oldNode: ProseMirrorNode;
  oldDecorations: readonly Decoration[];
  oldInnerDecorations: DecorationSource;
  newNode: ProseMirrorNode;
  newDecorations: readonly Decoration[];
  innerDecorations: DecorationSource;
  updateProps: () => void;
}

export type AttrProps =
  | Record<string, string>
  | ((props: {
      node: ProseMirrorNode;
      HTMLAttributes: Record<string, unknown>;
    }) => Record<string, string>);

export interface AngularNodeViewRendererOptions extends NodeViewRendererOptions {
  update?: ((props: RendererUpdateProps) => boolean) | null;
  injector: Injector;
  attrs?: AttrProps;
}

export const AngularNodeViewRenderer = (
  ViewComponent: Type<AngularNodeViewComponent>,
  options: Partial<AngularNodeViewRendererOptions>,
): NodeViewRenderer => {
  return (props) => {
    return new AngularNodeView(ViewComponent, props, options as AngularNodeViewRendererOptions);
  };
};
