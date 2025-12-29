#!/usr/bin/env node

/**
 * Media Update Publisher
 *
 * Rebuilds the site and publishes changes when media.json files are updated.
 *
 * Usage:
 *   npm run publish:media
 *   node scripts/publish-media.js
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

function run(cmd, options = {}) {
  console.log(`\n🔧 ${cmd}`);
  try {
    execSync(cmd, {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      ...options
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${cmd}`);
    return false;
  }
}

async function main() {
  console.log('\n📦 Media Update Publisher\n');
  console.log('=' .repeat(50));

  // Step 1: Build the site
  console.log('\n📖 Step 1: Building site...');
  if (!run('npm run build')) {
    process.exit(1);
  }

  // Step 2: Git add, commit, and push
  console.log('\n📝 Step 2: Committing to Git...');

  // Check if there are changes
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT_DIR, encoding: 'utf8' });

    if (status.trim()) {
      run('git add -A');

      const date = new Date().toISOString().split('T')[0];
      const commitMsg = `content: update media ${date}`;

      run(`git commit -m "${commitMsg}"`);
      run('git push');
      console.log('✅ Git push complete');
    } else {
      console.log('ℹ️  No changes to commit');
    }
  } catch (error) {
    console.log('ℹ️  Git operations skipped');
  }

  // Step 3: FTP Deploy
  console.log('\n🔌 Step 3: Deploying via FTP...');

  const ftp = require('basic-ftp');
  require('dotenv').config({ path: path.join(ROOT_DIR, '.env') });

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: process.env.FTP_SERVER,
      user: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      secure: false
    });

    console.log('📂 Connected to FTP server');

    // Upload dist folder
    await client.ensureDir(process.env.FTP_SERVER_DIR);
    await client.uploadFromDir(path.join(ROOT_DIR, 'dist'), process.env.FTP_SERVER_DIR);

    console.log('✅ FTP deployment complete');
  } catch (error) {
    console.error('❌ FTP error:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }

  console.log('\n' + '=' .repeat(50));
  console.log('✨ Media update published successfully!\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
