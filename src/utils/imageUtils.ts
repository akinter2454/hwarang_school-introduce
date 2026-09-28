/**
 * Client-side image compressor for Firebase Realtime Database.
 *
 * 학생 사진은 별도 Storage 없이 data:image/jpeg;base64,... 문자열로
 * Realtime Database에 저장됩니다. 무료 사용량을 아끼기 위해 업로드 전에
 * 해상도와 JPEG 용량을 자동으로 줄입니다.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 900,
  maxHeight = 675,
  quality = 0.74,
  targetDataUrlLength = 180_000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        const scale = Math.min(1, maxWidth / width, maxHeight / height);
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));

        let lastDataUrl = '';

        for (let attempt = 0; attempt < 7; attempt += 1) {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const currentQuality = Math.max(0.46, quality - attempt * 0.055);
          lastDataUrl = canvas.toDataURL('image/jpeg', currentQuality);

          if (lastDataUrl.length <= targetDataUrlLength) {
            resolve(lastDataUrl);
            return;
          }

          // 품질만 낮추는 것보다 화면 크기도 조금씩 줄여
          // 글자와 공간 형태가 지나치게 뭉개지는 것을 줄입니다.
          width = Math.max(480, Math.round(width * 0.88));
          height = Math.max(360, Math.round(height * 0.88));
        }

        resolve(lastDataUrl || (readerEvent.target?.result as string));
      };

      img.onerror = () =>
        reject(new Error('이미지를 불러오는데 실패했습니다.'));

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () =>
      reject(new Error('파일 읽기 오류가 발생했습니다.'));

    reader.readAsDataURL(file);
  });
}
