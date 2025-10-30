--- a/js/utils.js
+++ b/js/utils.js
 function openPdf(base64str) {
-    const str = String(base64str).split("data:application/pdf;base64,")[1];
+    // もしURLが来たらそのまま開く
+    if (/^https?:\/\//i.test(base64str)) {
+      window.open(base64str, '_blank', 'noopener');
+      return;
+    }
+    const str = String(base64str).split("data:application/pdf;base64,")[1];
     var byteCharacters = atob(str);
     var byteNumbers = new Array(byteCharacters.length);
