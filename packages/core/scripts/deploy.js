require('dotenv').config();
const { execSync } = require('child_process');
const ftp = require("basic-ftp");
const path = require('path');
const fs = require('fs');

// We are calling this script from the project root (e.g. packages/todo)
// So process.cwd() is correctly set to the project root.
async function deploy() {
    // Load monorepo root .env for shared credentials (Hostinger, UPLOAD_*)
    // script is in packages/core/scripts, so root is ../../..
    const MONOREPO_ROOT = path.join(__dirname, '../../..');
    require('dotenv').config({ path: path.join(MONOREPO_ROOT, '.env') });

    // Check for required environment variables
    if (!process.env.UPLOAD_HOST || !process.env.UPLOAD_USER || !process.env.UPLOAD_PASS || !process.env.UPLOAD_PORT) {
        console.error("❌ Error: Missing SSH credentials in .env file.");
        console.error("Please ensure UPLOAD_HOST, UPLOAD_USER, UPLOAD_PASS, and UPLOAD_PORT are set.");
        process.exit(1);
    }

    // FTP Configuration / SSH Configuration
    const host = process.env.UPLOAD_HOST;
    const user = process.env.UPLOAD_USER;
    const password = process.env.UPLOAD_PASS;
    const port = process.env.UPLOAD_PORT || 65002;

    const ROOT_DIR = process.cwd(); // Assume running from package root
    const DIST_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT_DIR, 'dist');

    // Determine remote dir based on domain
    let remoteDir = process.env.REMOTE_DIR;
    if (!remoteDir && process.env.DOMAIN) {
        // Absolute path for SCP/SSH: /home/user/domains/domain.com/public_html/
        remoteDir = `/home/${user}/domains/${process.env.DOMAIN}/public_html/`;
    }

    if (!remoteDir) {
        console.error("❌ Error: REMOTE_DIR not set.");
        process.exit(1);
    }

    // Local dir
    const localDir = DIST_DIR;

    // Zip + Upload + Unzip Strategy
    console.log(`🚀 Deploying via Zip + SCP (stable)...`);

    const zipFile = path.join(ROOT_DIR, 'deploy.zip');

    try {
        // 1. Zip files
        console.log(`\n📦 Zipping files...`);
        // cd to dist dir and zip everything to project root deploy.zip
        execSync(`cd "${localDir}" && zip -r "${zipFile}" . -x "*.DS_Store"`, { stdio: 'inherit' });

        // 2. Ensure remote dir exists
        console.log(`\n📂 Ensuring remote directory exists: ${remoteDir}`);
        const mkdirCmd = `sshpass -p "${password}" ssh -p ${port} -o StrictHostKeyChecking=no ${user}@${host} "mkdir -p ${remoteDir}"`;
        execSync(mkdirCmd, { stdio: 'inherit' });

        // 3. Upload Zip
        console.log(`\n📤 Uploading zip...`);
        const scpCmd = `sshpass -p "${password}" scp -P ${port} -o StrictHostKeyChecking=no "${zipFile}" ${user}@${host}:${remoteDir}deploy.zip`;
        execSync(scpCmd, { stdio: 'inherit' });

        // 4. Unzip on server
        console.log(`\n📂 Unzipping on server...`);
        const unzipCmd = `sshpass -p "${password}" ssh -p ${port} -o StrictHostKeyChecking=no ${user}@${host} "cd ${remoteDir} && unzip -o deploy.zip && rm deploy.zip"`;
        execSync(unzipCmd, { stdio: 'inherit' });

        // Fix permissions explicitly
        console.log(`\n🔧 Setting correct permissions...`);
        const chmodCmd = `sshpass -p "${password}" ssh -p ${port} -o StrictHostKeyChecking=no ${user}@${host} "chmod -R 644 ${remoteDir}*.html ${remoteDir}*/*.html 2>/dev/null || true"`;
        execSync(chmodCmd, { stdio: 'inherit' });

        // Purge Cloudflare cache
        const CF_API_KEY = process.env.CF_API_KEY;
        const CF_EMAIL = process.env.CF_EMAIL;
        const CF_ZONE_ID = process.env.CF_ZONE_ID;
        if (CF_API_KEY && CF_EMAIL && CF_ZONE_ID) {
            console.log(`\n🌐 Purging Cloudflare cache...`);
            try {
                const curlCmd = `curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_API_KEY}" -H "Content-Type: application/json" --data '{"purge_everything":true}'`;
                const result = execSync(curlCmd, { encoding: 'utf8' });
                const parsed = JSON.parse(result);
                if (parsed.success) {
                    console.log("✅ Cloudflare cache purged successfully!");
                } else {
                    console.log("⚠️  Cloudflare purge response:", result);
                }
            } catch (cfErr) {
                console.log("⚠️  Cloudflare cache purge failed (non-blocking):", cfErr.message);
            }
        } else {
            console.log("\n⚠️  Skipping Cloudflare cache purge (CF_API_KEY/CF_EMAIL/CF_ZONE_ID not set)");
        }

        console.log("\n✅ Deployment complete!");
    } catch (err) {
        console.error("❌ Zip Deployment failed:", err.message);
        process.exit(1);
    } finally {
        // Cleanup local zip
        if (fs.existsSync(zipFile)) {
            fs.unlinkSync(zipFile);
        }
    }
}

deploy();
