/**
 * base64 から PDF を新しいタブで開く（同期的に window.open 実行）
 * - data:URL / 生 base64 の両方に対応
 * - Blob MIME は application/pdf
 * - アラート等は一切出さない
 */
function openPdf(base64str) {
  // 直URLならそのまま新タブ
  if (/^https?:\/\//i.test(base64str)) {
    window.open(base64str, "_blank", "noopener");
    return;
  }

  // data:URL でも生 b64 でも受ける
  let b64 = String(base64str || "");
  const m = b64.match(/^data:application\/pdf;base64,(.*)$/i);
  if (m) b64 = m[1];
  b64 = b64.replace(/\s+/g, "");

  // ここまで完全に同期処理 → ユーザー操作のスタック内を維持
  var byteCharacters = atob(b64);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);
  // MIME を正す（←ここだけ元コードから修正）
  var file = new Blob([byteArray], { type: "application/pdf" });
  var fileURL = URL.createObjectURL(file);

  // ユーザー操作内で同期的に open（ブロックされにくい）
  window.open(fileURL, "_blank", "noopener");

  // 後で解放（任意）
  setTimeout(function(){ URL.revokeObjectURL(fileURL); }, 30000);
}
