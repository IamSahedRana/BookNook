const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
// Overridable so tests can point at a fake server. Real value: https://api.imgbb.com/1/upload
const IMGBB_URL = process.env.NEXT_PUBLIC_IMGBB_API_URL ?? "https://api.imgbb.com/1/upload";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_MB = 5;

export class UploadError extends Error {}

/** Returns a message if the file can't be uploaded, otherwise null. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPG, PNG or WebP image.";
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `That image is too big. The limit is ${MAX_IMAGE_MB} MB.`;
  }
  return null;
}

/**
 * Uploads an image to imgbb and returns its public link (https://i.ibb.co/...).
 * Uses XMLHttpRequest because fetch can't report upload progress.
 */
export function uploadToImgbb(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!IMGBB_KEY) {
      reject(
        new UploadError(
          "Image upload is not set up. Add NEXT_PUBLIC_IMGBB_KEY to .env.local and restart the client."
        )
      );
      return;
    }

    const body = new FormData();
    body.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${IMGBB_URL}?key=${encodeURIComponent(IMGBB_KEY)}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        const url: unknown = json?.data?.url ?? json?.data?.display_url;
        if (xhr.status >= 200 && xhr.status < 300 && typeof url === "string") {
          onProgress?.(100);
          resolve(url);
          return;
        }
        const reason = json?.error?.message;
        reject(new UploadError(reason ? `imgbb says: ${reason}` : "The image could not be uploaded. Please try again."));
      } catch {
        reject(new UploadError("The image could not be uploaded. Please try again."));
      }
    };
    xhr.onerror = () =>
      reject(new UploadError("Could not reach the image service. Check your internet connection."));
    xhr.ontimeout = () => reject(new UploadError("The upload took too long. Please try again."));
    xhr.timeout = 60_000;

    xhr.send(body);
  });
}
