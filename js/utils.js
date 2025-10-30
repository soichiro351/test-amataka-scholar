/**
 * PDF を新規タブで開く
 * - 通常URL / data:URL / 生base64 の三形態に対応
 * - Blob の MIME は application/pdf
 */
function openPdf(input) {
  try {
    // 1) URL ならそのまま
    if (/^https?:\/\//i.test(input)) {
      window.open(input, "_blank", "noopener");
      return;
    }

    // 2) data:URL or 生 base64
    let b64 = String(input || "");
    const m = b64.match(/^data:application\/pdf;base64,(.*)$/i);
    if (m) b64 = m[1];
    b64 = b64.replace(/\s+/g, "");

    const byteCharacters = atob(b64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    const w = window.open(fileURL, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(fileURL), 30000);
    if (!w) {
      alert("ポップアップがブロックされました。ブラウザ設定で許可してください。");
    }
  } catch (e) {
    console.error(e);
    alert("PDFを開けませんでした。ファイル形式をご確認ください。");
  }
}
