require('dotenv').config();
const ftp = require("basic-ftp");
const path = require("path");

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    // Check for required environment variables
    if (!process.env.FTP_SERVER || !process.env.FTP_USERNAME || !process.env.FTP_PASSWORD) {
        console.error("❌ Error: Missing FTP credentials in .env file.");
        console.error("Please ensure FTP_SERVER, FTP_USERNAME, and FTP_PASSWORD are set.");
        process.exit(1);
    }

    const remoteDir = process.env.FTP_SERVER_DIR || "/public_html";

    try {
        console.log(`🔌 Connecting to FTP (${process.env.FTP_SERVER})...`);
        await client.access({
            host: process.env.FTP_SERVER,
            user: process.env.FTP_USERNAME,
            password: process.env.FTP_PASSWORD,
            secure: false // Set to true if using FTPS
        });

        console.log(`📂 Uploading files to ${remoteDir}...`);
        
        // Upload the contents of the local 'dist' directory to the remote directory
        await client.uploadFromDir(path.join(__dirname, "../dist"), remoteDir);

        console.log("✅ FTP Deployment complete!");
    } catch(err) {
        console.error("❌ Deployment failed:", err);
        process.exit(1);
    }
    client.close();
}

deploy();
