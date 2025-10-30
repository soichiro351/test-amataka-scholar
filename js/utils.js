/**
 * 新しいタブでPDFを開く（ポップアップ警告を回避）
 * 仕組み:
 * 1) クリック直後に空タブ(about:blank)を開く → ここが「ユーザー操作」扱い
 * 2) base64/data:URL/直URL を判定し、Blob URL を生成
 * 3) その空タブの location を PDF に差し替える
 */
function openPdf(input) {
  // 1) クリック直後に空タブを作る（ここが重要）
  const win = window.open("", "_blank", "noopener"); // ここで確保できれば警告は出ない
  // win が null の場合でも、後続でアンカーの擬似クリックにフォールバックする

  try {
    // 直URL(https://...)なら即差し替え
    if (/^https?:\/\//i.test(input)) {
      if (win) {
        win.location.href = input;
      } else {
        const a = document.createElement("a");
        a.href = input;
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      return;
    }

    // data:URL or 生base64
    let b64 = String(input || "");
    const m = b64.match(/^data:application\/pdf;base64,(.*)$/i);
    if (m) b64 = m[1];
    b64 = b64.replace(/\s+/g, "");

    // base64 → Blob (同期処理なのでユーザー操作の呼び出しスタック内で完了)
    const byteChars = atob(b64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
    const blob = new Blob([new Uint8Array(byteNums)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // 2) 空タブにPDFを表示（ポップアップ扱いにならない）
    if (win) {
      win.location.href = url;
    } else {
      // 極まれに window.open がブロックされた場合のフォールバック（警告なし）
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    // 3) 後片付け（少し遅らせて解放）
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } catch (err) {
    // 失敗時も警告ダイアログは出さず、コンソールにのみ記録
    console.error("openPdf error:", err);
    if (win && !win.closed) {
      try { win.close(); } catch (_) { /* noop */ }
    }
  }
}
