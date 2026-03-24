export function centerOnScreen(width: number, height: number, targetWidth: number, targetHeight: number): {
  x: number;
  y: number;
} {
  return {
    x: (width - targetWidth) / 2,
    y: (height - targetHeight) / 2,
  };
}
