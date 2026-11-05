import {
  computeDragCropRect,
  computeCanvasCropCoordinates,
  computeCreateCropRect,
  computeCropPixels,
  normalizeCropRegion,
  denormalizeCropRegion,
  isFullCrop,
  applyCropToElement,
  getCropInlineStyle,
  CropRect,
  CropRegion,
} from './image-cropper-math';

describe('image-cropper-math', () => {
  const initialRect: CropRect = { x: 50, y: 50, width: 100, height: 100 };

  describe('computeDragCropRect', () => {
    it('deve mover o retângulo sem alterar o tamanho com modo "move"', () => {
      const result = computeDragCropRect(initialRect, 'move', 20, 30);
      expect(result).toEqual({ x: 70, y: 80, width: 100, height: 100 });
    });

    it('deve redimensionar a partir da direita', () => {
      const result = computeDragCropRect(initialRect, 'right', 40, 0);
      expect(result).toEqual({ x: 50, y: 50, width: 140, height: 100 });
    });

    it('deve redimensionar a partir da esquerda e deslocar x', () => {
      const result = computeDragCropRect(initialRect, 'left', 20, 0);
      expect(result).toEqual({ x: 70, y: 50, width: 80, height: 100 });
    });

    it('deve redimensionar a partir de baixo', () => {
      const result = computeDragCropRect(initialRect, 'bottom', 0, 50);
      expect(result).toEqual({ x: 50, y: 50, width: 100, height: 150 });
    });

    it('deve redimensionar a partir do topo e deslocar y', () => {
      const result = computeDragCropRect(initialRect, 'top', 0, 20);
      expect(result).toEqual({ x: 50, y: 70, width: 100, height: 80 });
    });

    it('deve redimensionar diagonalmente com bottomRight', () => {
      const result = computeDragCropRect(initialRect, 'bottomRight', 20, 30);
      expect(result).toEqual({ x: 50, y: 50, width: 120, height: 130 });
    });

    it('deve redimensionar diagonalmente com topLeft', () => {
      const result = computeDragCropRect(initialRect, 'topLeft', 10, 15);
      expect(result).toEqual({ x: 60, y: 65, width: 90, height: 85 });
    });

    it('deve respeitar tamanho mínimo (minSize)', () => {
      const result = computeDragCropRect(initialRect, 'right', -90, 0, 400, 400, 40);
      expect(result.width).toBe(40);
    });

    it('não deve ultrapassar limites do container', () => {
      const result = computeDragCropRect(initialRect, 'move', 300, 300, 200, 200);
      expect(result.x + result.width).toBeLessThanOrEqual(200);
      expect(result.y + result.height).toBeLessThanOrEqual(200);
    });
  });

  describe('computeCanvasCropCoordinates', () => {
    it('deve calcular coordenadas de escala proporcionalmente', () => {
      const cropRect: CropRect = { x: 50, y: 100, width: 200, height: 150 };
      const display = { width: 400, height: 300 };
      const natural = { width: 800, height: 600 }; // escala 2x

      const coords = computeCanvasCropCoordinates(
        cropRect,
        display.width,
        display.height,
        natural.width,
        natural.height,
      );

      expect(coords).toEqual({
        cropX: 100,
        cropY: 200,
        cropWidth: 400,
        cropHeight: 300,
      });
    });

    it('deve lançar erro com dimensões zeradas ou inválidas', () => {
      expect(() => {
        computeCanvasCropCoordinates(initialRect, 0, 100, 100, 100);
      }).toThrowError('Dimensões inválidas para recorte da imagem.');
    });
  });

  describe('normalizeCropRegion e denormalizeCropRegion', () => {
    it('deve normalizar coordenadas em relação ao container (0 a 1)', () => {
      const rect: CropRect = { x: 50, y: 100, width: 200, height: 150 };
      const normalized = normalizeCropRegion(rect, 400, 300);

      expect(normalized).toEqual({
        x: 0.125,
        y: 0.333333,
        width: 0.5,
        height: 0.5,
      });
    });

    it('deve desnormalizar CropRegion de volta para coordenadas em pixels', () => {
      const region: CropRegion = { x: 0.25, y: 0.5, width: 0.5, height: 0.25 };
      const denormalized = denormalizeCropRegion(region, 400, 400);

      expect(denormalized).toEqual({
        x: 100,
        y: 200,
        width: 200,
        height: 100,
      });
    });

    it('deve limitar valores entre 0 e 1 ao normalizar', () => {
      const rect: CropRect = { x: -10, y: -20, width: 600, height: 500 };
      const normalized = normalizeCropRegion(rect, 400, 400);

      expect(normalized.x).toBe(0);
      expect(normalized.y).toBe(0);
      expect(normalized.x + normalized.width).toBeLessThanOrEqual(1);
      expect(normalized.y + normalized.height).toBeLessThanOrEqual(1);
    });
  });

  describe('computeCropPixels (Normalized coordinates conversion to original image pixels)', () => {
    it('deve converter coordenadas normalizadas para pixels exatos da imagem original', () => {
      const region: CropRegion = { x: 0.1, y: 0.2, width: 0.5, height: 0.6 };
      const naturalWidth = 1920;
      const naturalHeight = 1080;

      const pixels = computeCropPixels(region, naturalWidth, naturalHeight);

      expect(pixels).toEqual({
        cropX: 192,
        cropY: 216,
        cropWidth: 960,
        cropHeight: 648,
      });
    });

    it('não deve exceder os limites da imagem original', () => {
      const region: CropRegion = { x: 0.8, y: 0.8, width: 0.5, height: 0.5 };
      const naturalWidth = 1000;
      const naturalHeight = 1000;

      const pixels = computeCropPixels(region, naturalWidth, naturalHeight);

      expect(pixels.cropX + pixels.cropWidth).toBeLessThanOrEqual(naturalWidth);
      expect(pixels.cropY + pixels.cropHeight).toBeLessThanOrEqual(naturalHeight);
    });

    it('deve lançar erro se dimensões naturais forem zero ou inválidas', () => {
      const region: CropRegion = { x: 0, y: 0, width: 1, height: 1 };
      expect(() => computeCropPixels(region, 0, 100)).toThrowError();
    });
  });

  describe('computeCreateCropRect (Criação de seleção por clique e arrasto)', () => {
    it('deve criar seleção ao arrastar do canto superior esquerdo para inferior direito', () => {
      const rect = computeCreateCropRect({ x: 20, y: 30 }, { x: 120, y: 150 }, 400, 400);

      expect(rect).toEqual({
        x: 20,
        y: 30,
        width: 100,
        height: 120,
      });
    });

    it('deve criar seleção corretamente ao arrastar em direção invertida (para cima/esquerda)', () => {
      const rect = computeCreateCropRect({ x: 150, y: 200 }, { x: 50, y: 80 }, 400, 400);

      expect(rect).toEqual({
        x: 50,
        y: 80,
        width: 100,
        height: 120,
      });
    });

    it('deve respeitar tamanho mínimo (minSize)', () => {
      const rect = computeCreateCropRect({ x: 50, y: 50 }, { x: 55, y: 55 }, 400, 400, 40);

      expect(rect.width).toBeGreaterThanOrEqual(40);
      expect(rect.height).toBeGreaterThanOrEqual(40);
    });

    it('deve respeitar os limites do container', () => {
      const rect = computeCreateCropRect({ x: 350, y: 350 }, { x: 500, y: 500 }, 400, 400);

      expect(rect.x + rect.width).toBeLessThanOrEqual(400);
      expect(rect.y + rect.height).toBeLessThanOrEqual(400);
    });
  });

  describe('isFullCrop', () => {
    it('deve retornar true para null ou undefined', () => {
      expect(isFullCrop(null)).toBeTrue();
      expect(isFullCrop(undefined)).toBeTrue();
    });

    it('deve retornar true quando a região cobre aproximadamente 100% da imagem', () => {
      expect(isFullCrop({ x: 0, y: 0, width: 1, height: 1 })).toBeTrue();
      expect(isFullCrop({ x: 0.0005, y: 0.0005, width: 0.9995, height: 0.9995 })).toBeTrue();
    });

    it('deve retornar false quando a região é menor que a imagem', () => {
      expect(isFullCrop({ x: 0.1, y: 0, width: 0.8, height: 1 })).toBeFalse();
    });
  });

  describe('applyCropToElement e getCropInlineStyle', () => {
    it('deve aplicar estilo de simulação e remover quando crop for null', () => {
      const img = document.createElement('img');
      const crop: CropRegion = { x: 0.1, y: 0.2, width: 0.6, height: 0.5 };

      applyCropToElement(img, crop);
      const hasStyle =
        img.style.getPropertyValue('object-view-box') !== '' || img.style.clipPath !== '';
      expect(hasStyle).toBeTrue();

      applyCropToElement(img, null);
      expect(img.style.getPropertyValue('object-view-box')).toBe('');
      expect(img.style.clipPath).toBe('');
    });

    it('deve gerar string de estilo inline correspondente', () => {
      const crop: CropRegion = { x: 0.1, y: 0.2, width: 0.6, height: 0.5 };
      const inlineStyle = getCropInlineStyle(crop);

      expect(inlineStyle).toContain('object-view-box: inset(');
      expect(getCropInlineStyle(null)).toBe('');
    });
  });
});
