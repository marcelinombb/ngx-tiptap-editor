# Image Extension Package

## Overview

Comprehensive image management package for Tiptap and Angular, providing HTML `<figure>` and `<figcaption>` wrappers, responsive width controls, alignment classes, proxy routing, and interactive canvas cropping with 8-direction handles.

## Interface

- `[Figure.ts:Figure]`: Tiptap node representing the figure container wrapping an image and optional caption.
- `[Figcaption.ts:Figcaption]`: Tiptap node representing the figure caption.
- `[image.ts:Image]`: Tiptap node for core image handling and paste rules.
- `[image.ts:ImageProxyBuilders]`: Utility builders for image proxy URLs (`queryParam`, `pathEncoded`, `postBody`).
- `[image.ts:ImageProxyUrlBuilder]`: Function type interface for custom proxy resolution.
- `[image.ts:POST_BODY_TOKEN]`: Sentinel token (`'__POST__'`) designating POST-based proxy requests.
- `[image.ts:convertToBase64]`: Utility function converting File objects to data URL strings via FileReader.
- `[image.ts:parseImagesToBase64]`: Upload handler inserting base64 images into the editor.
- `[figure-commands.ts:createFigureCommands]`: ProseMirror commands for toggling alignment, captions, and dimensions.
- `[figure-plugins.ts:createFigurePlugins]`: ProseMirror plugin factory for handling drag-and-drop and selection of figures.
- `[figure-utils.ts:MIN_WIDTH]`: Minimum supported figure width constant (50px).
- `[figure-utils.ts:MAX_WIDTH]`: Maximum supported figure width constant (700px).
- `[figure-utils.ts:ALIGN]`: Enumeration of figure alignment options (`left`, `middle`, `right`, `inlineLeft`, `inlineRight`).
- `[figure-utils.ts:parseWidth]`: Width string parsing and boundary validation helper.
- `[figure.component.ts:FigureComponent]`: Angular NodeView component handling image rendering, overlay controls, and resize interactions.
- `[ImageCropper.ts:ImageCropper]`: Interactive cropping controller attaching overlay handles and drag mechanics to image elements.
- `[image-cropper-canvas.ts:generateCroppedImage]`: Canvas rendering utility generating cropped image Blobs.
- `[image-cropper-canvas.ts:cropImageToDataUrl]`: Utility rendering cropped viewport to a base64 data URL.
- `[image-cropper-math.ts:DEFAULT_MIN_CROP_SIZE]`: Minimum pixel constraint for crop boxes (40px).
- `[image-cropper-math.ts:normalizeCropRegion]`: Converts crop pixel coordinates to unit-interval fractions [0, 1].
- `[image-cropper-math.ts:denormalizeCropRegion]`: Converts fraction-based crop regions back to absolute pixel bounds.
- `[image-cropper-math.ts:computeDragCropRect]`: Mathematical calculation for bounding box adjustment during handle drag.
- `[imageView.ts:ImageView]`: ProseMirror NodeView managing vanilla image resizing and aspect ratio preservation.

## Invariants

- `[Figure.ts:Figure]`: Schema content requires exactly one image followed by an optional caption (`image figcaption?`).
- `[figure-utils.ts:parseWidth]`: Image width values are strictly clamped between `MIN_WIDTH` (50px) and `MAX_WIDTH` (700px).
- `[image-cropper-math.ts:DEFAULT_MIN_CROP_SIZE]`: Interactive crop box size cannot shrink below 40px in either dimension.
- `[image-cropper-math.ts:normalizeCropRegion]`: Normalized crop coordinates are guaranteed to be within [0, 1].

## Side Effects

- `[image-cropper-canvas.ts:generateCroppedImage]`: Allocates in-memory HTML5 Canvas and reads pixel data via `ctx.drawImage`.
- `[ImageCropper.ts:ImageCropper]`: Binds global mouse and touch event listeners on `window` and `document` during crop adjustments.
- `[imageView.ts:ImageView]`: Mutates ProseMirror transaction state on resize release and updates DOM style widths.
- `[image.ts:parseImagesToBase64]`: Dispatches asynchronous FileReader reads.

## Verification

- Run: `npm test`
