/**
 * Portions of this code are derived from ngx-tiptap (MIT License)
 * Copyright (c) 2020-present Sibiraj <https://github.com/sibiraj-s/ngx-tiptap>
 * Adapted and maintained for ngx-tiptap-editor.
 */

import { Component, input } from '@angular/core';
import type {
  DecorationWithType,
  Editor,
  Node as NodeExtension,
  NodeViewProps,
} from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { DecorationSource, EditorView } from '@tiptap/pm/view';

type Inputs =
  | 'editor'
  | 'node'
  | 'decorations'
  | 'innerDecorations'
  | 'view'
  | 'selected'
  | 'extension'
  | 'HTMLAttributes'
  | 'getPos'
  | 'updateAttributes'
  | 'deleteNode';

type NodeViewPropsWithoutInputs = Omit<NodeViewProps, Inputs>;

@Component({
  template: '',
  standalone: true,
})
export class AngularNodeViewComponent implements NodeViewPropsWithoutInputs {
  readonly editor = input.required<Editor>();
  readonly node = input.required<ProseMirrorNode>();
  readonly decorations = input.required<readonly DecorationWithType[]>();
  readonly innerDecorations = input.required<DecorationSource>();
  readonly view = input.required<EditorView>();
  readonly selected = input.required<boolean>();
  readonly extension = input.required<NodeExtension>();
  readonly HTMLAttributes = input.required<Record<string, any>>();
  readonly getPos = input.required<() => number | undefined>();
  readonly updateAttributes = input.required<(attributes: Record<string, any>) => void>();
  readonly deleteNode = input.required<() => void>();
}
