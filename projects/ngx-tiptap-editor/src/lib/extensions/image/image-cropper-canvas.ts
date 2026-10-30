import {
  CropRect,
  CropRegion,
  computeCanvasCropCoordinates,
  computeCropPixels,
  isFullCrop,
} from './image-cropper-math';

/**
 * Generates a physical cropped image as a data URL using an offscreen canvas
 * from the original HTMLImageElement and the CropRegion metadata.
 *
 * Always uses the original image as the source.
 * Preserves the original image natural resolution.
 * Does not overwrite or mutate the original image.
 */
export function generateCroppedImage(
  image: HTMLImageElement,
  crop: CropRegion | null | undefined,
  mimeType = 'image/png',
  quality?: number,
): string {
  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error('Dimensões inválidas da imagem original.');
  }

  if (!crop || isFullCrop(crop)) {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Contexto 2D indisponível para recorte da imagem.');
    }
    context.drawImage(image, 0, 0);
    return canvas.toDataURL(mimeType, quality);
  }

  const { cropX, cropY, cropWidth, cropHeight } = computeCropPixels(
    crop,
    image.naturalWidth,
    image.naturalHeight,
  );

  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Contexto 2D indisponível para recorte da imagem.');
  }

  context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  return canvas.toDataURL(mimeType, quality);
}

/**
 * Crops an HTMLImageElement using an offscreen canvas and returns the base64 data URL.
 * Supports either pixel CropRect with display dimensions (retrocompatible)
 * or normalized CropRegion directly.
 */
export function cropImageToDataUrl(
  image: HTMLImageElement,
  cropRect: CropRect | CropRegion,
  displayWidth?: number,
  displayHeight?: number,
  mimeType = 'image/png',
  quality?: number,
): string {
  const { naturalWidth, naturalHeight } = image;
  if (!naturalWidth || !naturalHeight) {
    throw new Error('Dimensões inválidas para recorte da imagem.');
  }

  let cropX: number;
  let cropY: number;
  let cropWidth: number;
  let cropHeight: number;

  if (displayWidth == null || displayHeight == null) {
    const coords = computeCropPixels(cropRect as CropRegion, naturalWidth, naturalHeight);
    cropX = coords.cropX;
    cropY = coords.cropY;
    cropWidth = coords.cropWidth;
    cropHeight = coords.cropHeight;
  } else {
    const coords = computeCanvasCropCoordinates(
      cropRect as CropRect,
      displayWidth,
      displayHeight,
      naturalWidth,
      naturalHeight,
    );
    cropX = coords.cropX;
    cropY = coords.cropY;
    cropWidth = coords.cropWidth;
    cropHeight = coords.cropHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Contexto 2D indisponível para recorte da imagem.');
  }

  context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return canvas.toDataURL(mimeType, quality);
}
