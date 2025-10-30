--- a/js/search.js
+++ b/js/search.js
@@
-// 文字列エスケープ処理
-function escapeHTML(string){
-    return string.replace(/&/g, '&lt;')
-    .replace(/</g, '&lt;')
-    .replace(/>/g, '&gt;')
-    .replace(/"/g, '&quot;')
-    .replace(/'/g, "&#x27;");
-}
+// HTMLコンテキストで必要なときだけ使う（URL用では使わない！）
+function escapeHTML(string){
+  return String(string)
+    .replace(/&/g, '&amp;')
+    .replace(/</g, '&lt;')
+    .replace(/>/g, '&gt;')
+    .replace(/"/g, '&quot;')
+    .replace(/'/g, '&#x27;');
+}
+
+// fetch にタイムアウトを付けるユーティリティ
+async function fetchWithTimeout(resource, options = {}) {
+  const { timeout = 30000 } = options; // 30s
+  const controller = new AbortController();
+  const id = setTimeout(() => controller.abort(new Error('timeout')), timeout);
+  try {
+    const res = await fetch(resource, { ...options, signal: controller.signal });
+    return res;
+  } finally {
+    clearTimeout(id);
+  }
+}
 
 async function HandleWordSearch () {
@@
-    const searchWord   = escapeHTML(searchCompo.value);
+    const rawWord = searchCompo.value ?? '';
+    const searchWord = rawWord.trim();
@@
-    const url = FETCH_URL_SEARCH + `?type=search&keyword=${ searchWord }&category1=&category2`;
-    const fetchs = await fetch(url)
-        .then(res => res.json())
-        .then(data => {
-            return data;
-        });
+    // URLは必ず encodeURIComponent でエンコードする
+    const url = `${FETCH_URL_SEARCH}?type=search&keyword=${encodeURIComponent(searchWord)}&category1=&category2=`;
+    let fetchs;
+    try {
+      const res = await fetchWithTimeout(url, { timeout: 30000 }); // 30s
+      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
+      fetchs = await res.json();
+    } catch (e) {
+      console.error(e);
+      // 失敗画面表示＋ボタン復帰
+      for (let i = 0; i < showSearchWords.length; i++) {
+        showSearchWords[i].textContent = searchWord;
+      }
+      addClass(beforeScreen, "hidden");
+      addClass(resultScreen, "hidden");
+      removeClass(failScreen, "hidden");
+      addClass(loadScreen, "hidden");
+      // ボタン有効
+      const btns2 = document.getElementsByTagName("button");
+      for (let i = 0; i < btns2.length; i++) {
+        removeClass(btns2[i], "opacity-50");
+        btns2[i].disabled = false;
+      }
+      return;
+    }
@@
-            for (let i = 0; i < showSearchWords.length; i++) {
-            showSearchWords[i].innerHTML = searchWord;
-        }
+        for (let i = 0; i < showSearchWords.length; i++) {
+          showSearchWords[i].textContent = searchWord;
+        }
@@
-            for (let i = 0; i < showSearchWords.length; i++) {
-            showSearchWords[i].innerHTML = searchWord;
-        }
+        for (let i = 0; i < showSearchWords.length; i++) {
+          showSearchWords[i].textContent = searchWord;
+        }
@@
-    const url = FETCH_URL_SEARCH + `?type=search&keyword=&category1=${ category1 }&category2=${ category2 }`;
-    const fetchs = await fetch(url)
-        .then(res => res.json())
-        .then(data => {
-            return data;
-        });
+    const url = `${FETCH_URL_SEARCH}?type=search&keyword=&category1=${encodeURIComponent(category1)}&category2=${encodeURIComponent(category2)}`;
+    let fetchs;
+    try {
+      const res = await fetchWithTimeout(url, { timeout: 30000 });
+      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
+      fetchs = await res.json();
+    } catch (e) {
+      console.error(e);
+      for (let i = 0; i < showSearchWords.length; i++) {
+        showSearchWords[i].textContent = ctgry;
+      }
+      addClass(beforeScreen, "hidden");
+      addClass(resultScreen, "hidden");
+      removeClass(failScreen, "hidden");
+      addClass(loadScreen, "hidden");
+      // ボタン有効
+      const btns2 = document.getElementsByTagName("button");
+      for (let i = 0; i < btns2.length; i++) {
+        removeClass(btns2[i], "opacity-50");
+        btns2[i].disabled = false;
+      }
+      return;
+    }
@@
-            for (let i = 0; i < showSearchWords.length; i++) {
-                showSearchWords[i].innerHTML = ctgry;
-            }
+            for (let i = 0; i < showSearchWords.length; i++) {
+              showSearchWords[i].textContent = ctgry;
+            }
@@
-            for (let i = 0; i < showSearchWords.length; i++) {
-                showSearchWords[i].innerHTML = ctgry;
-            }
+            for (let i = 0; i < showSearchWords.length; i++) {
+              showSearchWords[i].textContent = ctgry;
+            }
