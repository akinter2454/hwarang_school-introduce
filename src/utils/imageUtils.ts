/**
 * Client-side image compressor using HTML Canvas
 * Resizes large smartphone photos to prevent exceeding localStorage quota.
 */
export async function compressImageFile(file: File, maxWidth = 1200, maxHeight = 900, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('이미지를 불러오는데 실패했습니다.'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });
}
