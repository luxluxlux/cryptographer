/**
 * Upload file by the system dialog
 */
export async function upload() {
    return new Promise<File>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.onchange = (event) => resolve((event.target as HTMLInputElement).files![0]);
        input.onerror = (error) => reject(error);
    });
}

/**
 * Download file
 * @param data Blob data
 * @param fileName Name string
 */
export function download(data: Blob, fileName: string) {
    const anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(data);
    anchor.download = fileName;
    anchor.click();
}

/**
 * Hide the end of the string under an ellipsis
 * @param text String
 * @param maxLength Max length of the string
 */
export function ellipse(text: string, maxLength: number) {
    return text.length > maxLength ? (text.slice(0, maxLength / 2) + '...' + text.slice(-maxLength / 2)) : text;
}