const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Delete files older than 1 hour
cron.schedule("0 * * * *", () => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
      const filePath = path.join(UPLOAD_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        const now = new Date().getTime();
        const fileTime = new Date(stats.mtime).getTime();
        if (now - fileTime > 3600 * 1000) {
          // 1 hour
          fs.unlink(filePath, () => console.log(`Deleted: ${file}`));
        }
      });
    });
  });
});
