/**
 * base64からpdfを別タブで開く
 * @param {*} base64str 
 */
function openPdf(base64str) {
    const str = String(base64str).split("data:application/pdf;base64,")[1];
    var byteCharacters = atob(str);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: 'application/pdf;base64' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
}