import ImageCropper, { CropTarget } from './ImageCropper';
import { Image } from './image';
import {
  CropRegion,
  computeCropPixels,
  computeDragCropRect,
  computeCreateCropRect,
  normalizeCropRegion,
  denormalizeCropRegion,
  applyCropToElement,
  isFullCrop,
} from './image-cropper-math';
import { generateCroppedImage, cropImageToDataUrl } from './image-cropper-canvas';

describe('Non-Destructive Image Crop Functionality', () => {
  let originalSrc: string;
  let mockImage: HTMLImageElement;
  let mockWrapper: HTMLDivElement;
  let updatedAttributes: Record<string, any>;
  let cropper: ImageCropper;

  beforeEach(() => {
    originalSrc =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9QzwAEjDAGYzAEAB8YBfvZ5g2hAAAAAElFTkSuQmCC';

    mockWrapper = document.createElement('div');
    mockWrapper.style.width = '300px';
    mockWrapper.style.height = '200px';
    document.body.appendChild(mockWrapper);

    mockImage = document.createElement('img');
    mockImage.src = originalSrc;
    // Define natural dimensions
    Object.defineProperty(mockImage, 'naturalWidth', { value: 600, configurable: true });
    Object.defineProperty(mockImage, 'naturalHeight', { value: 400, configurable: true });
    Object.defineProperty(mockImage, 'clientWidth', { value: 300, configurable: true });
    Object.defineProperty(mockImage, 'clientHeight', { value: 200, configurable: true });
    Object.defineProperty(mockImage, 'complete', { value: true, configurable: true });
    mockWrapper.appendChild(mockImage);

    updatedAttributes = {};

    const target: CropTarget = {
      image: mockImage,
      imageWrapper: mockWrapper,
      getCrop: () => updatedAttributes['crop'] ?? null,
      updateAttributes: (attrs: Record<string, any>) => {
        updatedAttributes = { ...updatedAttributes, ...attrs };
      },
    };

    cropper = new ImageCropper(target);
  });

  afterEach(() => {
    cropper.destroy();
    mockWrapper.remove();
  });

  it('1. Original image remains unchanged after crop confirmation', () => {
    cropper.toggle();
    expect(cropper.active).toBeTrue();

    // Simula clique em "Aplicar"
    const applyButton = mockWrapper.querySelector('.ex-crop-apply') as HTMLButtonElement;
    expect(applyButton).toBeDefined();
    applyButton.click();

    expect(cropper.active).toBeFalse();

    // A URL original da imagem NÃO deve ser sobrescrita
    expect(updatedAttributes['src']).toBeUndefined();
    expect(mockImage.src).toBe(originalSrc);

    // Deve salvar apenas os metadados de crop
    expect(updatedAttributes['crop']).toBeDefined();
    expect(updatedAttributes['crop'].width).toBeGreaterThan(0);
    expect(updatedAttributes['crop'].height).toBeGreaterThan(0);
  });

  it('2. Crop metadata is correctly stored in normalized coordinates (0 to 1)', () => {
    cropper.toggle();

    // Obtém região normalizada atual
    const region = cropper.getNormalizedCropRegion();

    expect(region.x).toBeGreaterThanOrEqual(0);
    expect(region.x).toBeLessThanOrEqual(1);
    expect(region.y).toBeGreaterThanOrEqual(0);
    expect(region.y).toBeLessThanOrEqual(1);
    expect(region.width).toBeGreaterThan(0);
    expect(region.width).toBeLessThanOrEqual(1);
    expect(region.height).toBeGreaterThan(0);
    expect(region.height).toBeLessThanOrEqual(1);
  });

  it('3. Selection can be moved and resized', () => {
    const startRect = { x: 50, y: 50, width: 100, height: 100 };

    // Move
    const moved = computeDragCropRect(startRect, 'move', 25, 35, 400, 300);
    expect(moved).toEqual({ x: 75, y: 85, width: 100, height: 100 });

    // Resize (corner bottomRight)
    const resized = computeDragCropRect(startRect, 'bottomRight', 30, 40, 400, 300);
    expect(resized).toEqual({ x: 50, y: 50, width: 130, height: 140 });

    // Resize (edge left)
    const leftResized = computeDragCropRect(startRect, 'left', 10, 0, 400, 300);
    expect(leftResized).toEqual({ x: 60, y: 50, width: 90, height: 100 });
  });

  it('4. Selection boundaries are respected', () => {
    const startRect = { x: 250, y: 150, width: 100, height: 100 };

    // Move além das dimensões do container (300 x 200)
    const movedOutOfBounds = computeDragCropRect(startRect, 'move', 100, 100, 300, 200);
    expect(movedOutOfBounds.x + movedOutOfBounds.width).toBeLessThanOrEqual(300);
    expect(movedOutOfBounds.y + movedOutOfBounds.height).toBeLessThanOrEqual(200);

    // Mover para coordenadas negativas
    const movedNegative = computeDragCropRect(startRect, 'move', -400, -300, 300, 200);
    expect(movedNegative.x).toBeGreaterThanOrEqual(0);
    expect(movedNegative.y).toBeGreaterThanOrEqual(0);
  });

  it('5. Preview updates when selection changes', () => {
    let lastCropChange: CropRegion | null = null;
    cropper.destroy();

    const target: CropTarget = {
      image: mockImage,
      imageWrapper: mockWrapper,
      onCropChange: (region: CropRegion) => {
        lastCropChange = region;
      },
      updateAttributes: (attrs: Record<string, any>) => {
        updatedAttributes = { ...updatedAttributes, ...attrs };
      },
    };
    cropper = new ImageCropper(target);
    cropper.toggle();

    // Reset selection dispara atualização de preview
    cropper.resetSelection();
    expect(lastCropChange).toBeDefined();
    expect((lastCropChange as any)?.width).toBe(1);
    expect((lastCropChange as any)?.height).toBe(1);

    // Estilos do cropArea atualizados no DOM
    const cropArea = mockWrapper.querySelector('.ex-crop-area') as HTMLDivElement;
    expect(cropArea.style.width).toBe('300px');
    expect(cropArea.style.height).toBe('200px');
  });

  it('6. Normalized coordinates are correctly converted to original image pixels', () => {
    const normalizedCrop: CropRegion = { x: 0.25, y: 0.1, width: 0.5, height: 0.75 };
    const naturalWidth = 1200;
    const naturalHeight = 800;

    const pixels = computeCropPixels(normalizedCrop, naturalWidth, naturalHeight);

    expect(pixels).toEqual({
      cropX: 300,
      cropY: 80,
      cropWidth: 600,
      cropHeight: 600,
    });
  });

  it('7. Final crop generation uses the original image and preserves natural resolution', () => {
    const crop: CropRegion = { x: 0.2, y: 0.2, width: 0.5, height: 0.5 };

    // Canvas mock / execution
    const dataUrl = generateCroppedImage(mockImage, crop);
    expect(dataUrl).toContain('data:image/png;base64');

    // Retrocompatibilidade de cropImageToDataUrl
    const retroDataUrl = cropImageToDataUrl(mockImage, crop);
    expect(retroDataUrl).toContain('data:image/png;base64');
  });

  it('8. Existing images without crop metadata remain compatible', () => {
    expect(isFullCrop(null)).toBeTrue();
    expect(isFullCrop(undefined)).toBeTrue();

    // Elemento sem crop não recebe restrições
    applyCropToElement(mockImage, null);
    expect(mockImage.style.getPropertyValue('object-view-box')).toBe('');
    expect(mockImage.style.clipPath).toBe('');
  });

  it('9. Repeated crop adjustments do not accumulate quality loss', () => {
    // 1º crop: 50% central
    cropper.toggle();
    const crop1: CropRegion = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 };
    updatedAttributes = { crop: crop1 };
    cropper.toggle(); // desativa

    // 2º crop: reabre e ajusta para 75%
    cropper.toggle();
    expect(mockImage.src).toBe(originalSrc); // Fonte sempre a imagem original intacta

    // 3º crop: redefine para imagem inteira
    const resetButton = mockWrapper.querySelector('.ex-crop-reset') as HTMLButtonElement;
    resetButton.click();

    const applyButton = mockWrapper.querySelector('.ex-crop-apply') as HTMLButtonElement;
    applyButton.click();

    // Como resetou, o crop final é null (imagem inteira) e src continua idêntico
    expect(updatedAttributes['crop']).toBeNull();
    expect(mockImage.src).toBe(originalSrc);
  });

  it('10. renderHTML da imagem deve vir com os estilos de recorte', () => {
    const crop: CropRegion = { x: 0.1, y: 0.2, width: 0.5, height: 0.6 };
    const renderResult = (Image.config.renderHTML as any).call(
      { options: { HTMLAttributes: {} } },
      {
        node: {
          attrs: {
            src: 'https://example.com/photo.png',
            crop,
          },
        },
        HTMLAttributes: {
          src: 'https://example.com/photo.png',
        },
      },
    );

    expect(renderResult[0]).toBe('img');
    const attrs = renderResult[1];
    expect(attrs.style).toContain('display: table-cell');
    expect(attrs.style).toContain('object-view-box: inset(');
    expect(attrs.style).not.toContain('clip-path');
    expect(attrs['data-crop']).toBe(JSON.stringify(crop));
  });
});
