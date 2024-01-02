export const fileToBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


export const composeId = (id1: string, id2: string) => {
    return [id1, id2].sort().join('');
}