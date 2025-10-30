--- a/js/utils.js
+++ b/js/utils.js
 /**
  * base64からpdfを別タブで開く
  * @param {*} base64str 
  */
 function openPdf(base64str) {
-    const str = String(base64str).split("data:application/pdf;base64,")[1];
-    var byteCharacters = atob(str);
-    var byteNumbers = new Array(byteCharacters.length);
-    for (var i = 0; i < byteCharacters.length; i++) {
-        byteNumbers[i] = byteCharacters.charCodeAt(i);
-    }
-    var byteArray = new Uint8Array(byteNumbers);
-    var file = new Blob([byteArray], { type: 'application/pdf;base64' });
-    var fileURL = URL.createObjectURL(file);
-    window.open(fileURL);
+  try {
+    // 1) もし通常のURLならそのまま開く（GASがURL返す場合の互換）
+    if (/^https?:\/\//i.test(base64str)) {
+      window.open(base64str, "_blank", "noopener");
+      return;
+    }
+
+    // 2) data URL でも生のbase64でも受け付ける
+    let b64 = String(base64str);
+    const m = b64.match(/^data:application\/pdf;base64,(.*)$/i);
+    if (m) {
+      b64 = m[1];
+    }
+    // 改行・空白を除去（atobは空白混入で失敗）
+    b64 = b64.replace(/\s+/g, "");
+
+    // 3) base64→Blob（MIMEは 'application/pdf' が正解）
+    const byteCharacters = atob(b64);
+    const byteNumbers = new Array(byteCharacters.length);
+    for (let i = 0; i < byteCharacters.length; i++) {
+      byteNumbers[i] = byteCharacters.charCodeAt(i);
+    }
+    const byteArray = new Uint8Array(byteNumbers);
+    const file = new Blob([byteArray], { type: "application/pdf" });
+    const fileURL = URL.createObjectURL(file);
+
+    // 4) 新規タブで開く（ユーザー操作由来なのでブロックされにくい）
+    const w = window.open(fileURL, "_blank", "noopener");
+    // 一定時間後にURLを解放（メモリリーク防止）
+    setTimeout(() => URL.revokeObjectURL(fileURL), 30_000);
+    if (!w) {
+      alert("ポップアップがブロックされました。ブラウザの設定で許可してください。");
+    }
+  } catch (e) {
+    console.error(e);
+    alert("PDFを開けませんでした。ファイル形式をご確認ください。");
+  }
 }
