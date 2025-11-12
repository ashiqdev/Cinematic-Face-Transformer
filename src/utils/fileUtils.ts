
export function fileToBase64(file: File): Promise<{ base64Data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      resolve({ base64Data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
}