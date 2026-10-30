export type CropHandleDirection =
  | 'move'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'create';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DEFAULT_MIN_CROP_SIZE = 40;

/**
 * Calculates new crop rectangle based on drag handle, displacement and boundaries.
 */
export function computeDragCropRect(
  startRect: CropRect,
  dragMode: CropHandleDirection,
  dx: number,
  dy: number,
  containerWidth?: number,
  containerHeight?: number,
  minSize: number = DEFAULT_MIN_CROP_SIZE,
): CropRect {
  let { x, y, width, height } = startRect;

  switch (dragMode) {
    case 'move':
      x = startRect.x + dx;
      y = startRect.y + dy;
      break;
    case 'left':
      x = startRect.x + dx;
      width = startRect.width - dx;
      break;
    case 'right':
      width = startRect.width + dx;
      break;
    case 'top':
      y = startRect.y + dy;
      height = startRect.height - dy;
      break;
    case 'bottom':
      height = startRect.height + dy;
      break;
    case 'topLeft':
      x = startRect.x + dx;
      y = startRect.y + dy;
      width = startRect.width - dx;
      height = startRect.height - dy;
      break;
    case 'topRight':
      y = startRect.y + dy;
      width = startRect.width + dx;
      height = startRect.height - dy;
      break;
    case 'bottomLeft':
      x = startRect.x + dx;
      width = startRect.width - dx;
      height = startRect.height + dy;
      break;
    case 'bottomRight':
      width = startRect.width + dx;
      height = startRect.height + dy;
      break;
  }

  const affectsLeft = ['left', 'topLeft', 'bottomLeft'].includes(dragMode);
  const affectsTop = ['top', 'topLeft', 'topRight'].includes(dragMode);

  if (width < minSize) {
    if (affectsLeft) {
      x = startRect.x + (startRect.width - minSize);
    }
    width = minSize;
  }

  if (height < minSize) {
    if (affectsTop) {
      y = startRect.y + (startRect.height - minSize);
    }
    height = minSize;
  }

  if (x < 0) {
    width += x;
    x = 0;
  }

  if (y < 0) {
    height += y;
    y = 0;
  }

  if (dragMode === 'move') {
    if (containerWidth != null) {
      if (x + width > containerWidth) {
        x = Math.max(0, containerWidth - width);
      }
      if (x < 0) {
        x = 0;
      }
    }
    if (containerHeight != null) {
      if (y + height > containerHeight) {
        y = Math.max(0, containerHeight - height);
      }
      if (y < 0) {
        y = 0;
      }
    }
    return { x, y, width, height };
  }

  if (containerWidth != null && x + width > containerWidth) {
    width = Math.max(minSize, containerWidth - x);
  }

  if (containerHeight != null && y + height > containerHeight) {
    height = Math.max(minSize, containerHeight - y);
  }

  return { x, y, width, height };
}

/**
 * Maps the displayed crop rectangle to the image natural dimensions for canvas cropping.
 */
export function computeCanvasCropCoordinates(
  cropRect: CropRect,
  displayWidth: number,
  displayHeight: number,
  naturalWidth: number,
  naturalHeight: number,
): { cropX: number; cropY: number; cropWidth: number; cropHeight: number } {
  if (!naturalWidth || !naturalHeight || !displayWidth || !displayHeight) {
    throw new Error('Dimensões inválidas para recorte da imagem.');
  }

  const scaleX = naturalWidth / displayWidth;
  const scaleY = naturalHeight / displayHeight;

  const cropX = Math.max(0, Math.round(cropRect.x * scaleX));
  const cropY = Math.max(0, Math.round(cropRect.y * scaleY));
  const cropWidth = Math.max(1, Math.round(cropRect.width * scaleX));
  const cropHeight = Math.max(1, Math.round(cropRect.height * scaleY));

  return { cropX, cropY, cropWidth, cropHeight };
}

/**
 * Checks if a CropRegion covers the full image (or effectively no crop).
 */
export function isFullCrop(crop: CropRegion | null | undefined): boolean {
  if (!crop) return true;
  return crop.x <= 0.001 && crop.y <= 0.001 && crop.width >= 0.999 && crop.height >= 0.999;
}

/**
 * Converts a pixel CropRect to normalized (0 to 1) CropRegion relative to container dimensions.
 */
export function normalizeCropRegion(
  cropRect: CropRect,
  containerWidth: number,
  containerHeight: number,
): CropRegion {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  const x = Math.max(0, Math.min(1, cropRect.x / containerWidth));
  const y = Math.max(0, Math.min(1, cropRect.y / containerHeight));
  const width = Math.max(0, Math.min(1 - x, cropRect.width / containerWidth));
  const height = Math.max(0, Math.min(1 - y, cropRect.height / containerHeight));

  return {
    x: Number(x.toFixed(6)),
    y: Number(y.toFixed(6)),
    width: Number(width.toFixed(6)),
    height: Number(height.toFixed(6)),
  };
}

/**
 * Converts a normalized (0 to 1) CropRegion to pixel CropRect relative to container dimensions.
 */
export function denormalizeCropRegion(
  region: CropRegion,
  containerWidth: number,
  containerHeight: number,
): CropRect {
  const x = Math.max(0, Math.round(region.x * containerWidth));
  const y = Math.max(0, Math.round(region.y * containerHeight));
  const width = Math.max(
    1,
    Math.min(containerWidth - x, Math.round(region.width * containerWidth)),
  );
  const height = Math.max(
    1,
    Math.min(containerHeight - y, Math.round(region.height * containerHeight)),
  );

  return { x, y, width, height };
}

/**
 * Maps a normalized CropRegion directly to pixels on the original image using natural dimensions.
 */
export function computeCropPixels(
  crop: CropRegion,
  naturalWidth: number,
  naturalHeight: number,
): { cropX: number; cropY: number; cropWidth: number; cropHeight: number } {
  if (!naturalWidth || !naturalHeight) {
    throw new Error('Dimensões inválidas da imagem para conversão de coordenadas.');
  }

  const cropX = Math.max(0, Math.min(naturalWidth - 1, Math.round(crop.x * naturalWidth)));
  const cropY = Math.max(0, Math.min(naturalHeight - 1, Math.round(crop.y * naturalHeight)));
  const cropWidth = Math.max(
    1,
    Math.min(naturalWidth - cropX, Math.round(crop.width * naturalWidth)),
  );
  const cropHeight = Math.max(
    1,
    Math.min(naturalHeight - cropY, Math.round(crop.height * naturalHeight)),
  );

  return { cropX, cropY, cropWidth, cropHeight };
}

/**
 * Calculates rectangle when user clicks and drags to create a new selection box.
 */
export function computeCreateCropRect(
  startPoint: { x: number; y: number },
  currentPoint: { x: number; y: number },
  containerWidth: number,
  containerHeight: number,
  minSize: number = DEFAULT_MIN_CROP_SIZE,
): CropRect {
  const clampedStartX = Math.max(0, Math.min(containerWidth, startPoint.x));
  const clampedStartY = Math.max(0, Math.min(containerHeight, startPoint.y));
  const clampedCurrentX = Math.max(0, Math.min(containerWidth, currentPoint.x));
  const clampedCurrentY = Math.max(0, Math.min(containerHeight, currentPoint.y));

  let x = Math.min(clampedStartX, clampedCurrentX);
  let y = Math.min(clampedStartY, clampedCurrentY);
  let width = Math.abs(clampedCurrentX - clampedStartX);
  let height = Math.abs(clampedCurrentY - clampedStartY);

  if (width < minSize) {
    width = Math.min(minSize, containerWidth - x);
    if (x + width > containerWidth) {
      x = Math.max(0, containerWidth - width);
    }
  }

  if (height < minSize) {
    height = Math.min(minSize, containerHeight - y);
    if (y + height > containerHeight) {
      y = Math.max(0, containerHeight - height);
    }
  }

  return { x, y, width, height };
}

function formatPercent(val: number): string {
  return `${parseFloat((val * 100).toFixed(4))}%`;
}

/**
 * Formats inset string for CSS clip-path or object-view-box from normalized CropRegion.
 */
export function getCropInsetString(crop: CropRegion): string {
  const top = formatPercent(crop.y);
  const right = formatPercent(1 - (crop.x + crop.width));
  const bottom = formatPercent(1 - (crop.y + crop.height));
  const left = formatPercent(crop.x);

  return `inset(${top} ${right} ${bottom} ${left})`;
}

/**
 * Parses CropRegion from an element's data-crop attribute or its CSS inset styles.
 */
export function parseCropFromElement(element: HTMLElement): CropRegion | null {
  const dataCrop =
    element.getAttribute('data-crop') || element.querySelector('img')?.getAttribute('data-crop');

  if (dataCrop) {
    try {
      const parsed = JSON.parse(dataCrop);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof parsed.x === 'number' &&
        typeof parsed.y === 'number' &&
        typeof parsed.width === 'number' &&
        typeof parsed.height === 'number'
      ) {
        return parsed;
      }
    } catch {
      // Continue to try parsing style
    }
  }

  const styleAttr =
    element.getAttribute('style') || element.querySelector('img')?.getAttribute('style') || '';

  const match = styleAttr.match(
    /(?:object-view-box|clip-path)\s*:\s*inset\(\s*([\d.]+)%\s+([\d.]+)%\s+([\d.]+)%\s+([\d.]+)%\s*\)/i,
  );
  if (match) {
    const top = parseFloat(match[1]) / 100;
    const right = parseFloat(match[2]) / 100;
    const bottom = parseFloat(match[3]) / 100;
    const left = parseFloat(match[4]) / 100;

    const x = Number(left.toFixed(6));
    const y = Number(top.toFixed(6));
    const width = Number((1 - left - right).toFixed(6));
    const height = Number((1 - top - bottom).toFixed(6));

    if (width > 0 && height > 0) {
      return { x, y, width, height };
    }
  }

  return null;
}

/**
 * Applies CSS simulation styles for a non-destructive crop to an HTML element (usually an <img>).
 */
export function applyCropToElement(
  element: HTMLElement,
  crop: CropRegion | null | undefined,
): void {
  if (!crop || isFullCrop(crop)) {
    element.style.removeProperty('object-view-box');
    element.style.removeProperty('clip-path');
    element.style.clipPath = '';
    return;
  }

  const insetVal = getCropInsetString(crop);
  element.style.setProperty('object-view-box', insetVal);
  element.style.removeProperty('clip-path');
  element.style.clipPath = '';
}

/**
 * Generates inline CSS string for renderHTML or export.
 */
export function getCropInlineStyle(crop: CropRegion | null | undefined): string {
  if (!crop || isFullCrop(crop)) {
    return '';
  }
  const insetVal = getCropInsetString(crop);
  return `object-view-box: ${insetVal};`;
}
