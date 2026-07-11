# 共用投票：Google Sheet + Apps Script

1. 建立一份 Google 試算表，從網址複製 `/d/` 與下一個 `/` 之間的試算表 ID。
2. 在試算表選「擴充功能 → Apps Script」，以本資料夾的 `Code.gs` 全部內容覆蓋預設程式。
3. 將 `SPREADSHEET_ID` 改成步驟 1 的 ID 並儲存。
4. 選「部署 → 新增部署作業 → 網頁應用程式」：執行身分選自己、存取權選任何人，然後部署。
5. 複製部署網址（結尾為 `/exec`），填入 `outputs/taichung-villa-vote.html` 的 `VOTE_API_URL`，提交並推送 GitHub。

每次投票會新增一列；同一瀏覽器的 `Client ID` 只會計算最後一票。這是輕量防重複機制，並非帳號驗證，公開連結仍可能被他人灌票。
