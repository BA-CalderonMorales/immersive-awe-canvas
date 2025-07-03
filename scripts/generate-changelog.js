const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Generate changelog based on conventional commits
 * Following the semantic versioning and conventional commits standards from RULES.md
 */
function generateChangelog() {
  try {
    // Get the last tag
    let lastTag;
    try {
      lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    } catch (error) {
      lastTag = 'v0.0.0'; // First release
    }

    // Get commits since last tag
    const commits = execSync(`git log ${lastTag}..HEAD --oneline`, { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(commit => commit.length > 0);

    if (commits.length === 0) {
      console.log('No new commits since last tag');
      return;
    }

    // Parse commits by type
    const changelog = {
      breaking: [],
      features: [],
      fixes: [],
      performance: [],
      chores: [],
      other: []
    };

    commits.forEach(commit => {
      const match = commit.match(/^[a-f0-9]+ (.+)$/);
      if (!match) return;
      
      const message = match[1];
      
      if (message.includes('BREAKING CHANGE') || message.includes('!:')) {
        changelog.breaking.push(message);
      } else if (message.startsWith('feat:')) {
        changelog.features.push(message.replace('feat:', '').trim());
      } else if (message.startsWith('fix:')) {
        changelog.fixes.push(message.replace('fix:', '').trim());
      } else if (message.startsWith('perf:')) {
        changelog.performance.push(message.replace('perf:', '').trim());
      } else if (message.startsWith('chore:')) {
        changelog.chores.push(message.replace('chore:', '').trim());
      } else {
        changelog.other.push(message);
      }
    });

    // Get current version from package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const currentVersion = packageJson.version;
    const currentDate = new Date().toISOString().split('T')[0];

    // Generate changelog content
    let changelogContent = '';
    
    // Read existing changelog if it exists
    if (fs.existsSync('CHANGELOG.md')) {
      const existingChangelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
      // Extract everything after the first version entry
      const versionPattern = /\n## \[/;
      const match = existingChangelog.match(versionPattern);
      if (match) {
        changelogContent = existingChangelog.substring(match.index);
      }
    }

    // Build new changelog entry
    let newEntry = `## [${currentVersion}] - ${currentDate}\n\n`;

    if (changelog.breaking.length > 0) {
      newEntry += '### ⚠️ BREAKING CHANGES\n';
      changelog.breaking.forEach(item => {
        newEntry += `- ${item}\n`;
      });
      newEntry += '\n';
    }

    if (changelog.features.length > 0) {
      newEntry += '### ✨ Features\n';
      changelog.features.forEach(item => {
        newEntry += `- ${item}\n`;
      });
      newEntry += '\n';
    }

    if (changelog.fixes.length > 0) {
      newEntry += '### 🐛 Bug Fixes\n';
      changelog.fixes.forEach(item => {
        newEntry += `- ${item}\n`;
      });
      newEntry += '\n';
    }

    if (changelog.performance.length > 0) {
      newEntry += '### ⚡ Performance\n';
      changelog.performance.forEach(item => {
        newEntry += `- ${item}\n`;
      });
      newEntry += '\n';
    }

    if (changelog.chores.length > 0) {
      newEntry += '### 🔧 Maintenance\n';
      changelog.chores.forEach(item => {
        newEntry += `- ${item}\n`;
      });
      newEntry += '\n';
    }

    if (changelog.other.length > 0) {
      newEntry += '### 📝 Other Changes\n';
      changelog.other.forEach(item => {
        newEntry += `- ${item}\n`;
      });
      newEntry += '\n';
    }

    // Write the complete changelog
    const fullChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

${newEntry}${changelogContent}`;

    fs.writeFileSync('CHANGELOG.md', fullChangelog);
    console.log(`✅ Generated changelog for version ${currentVersion}`);

  } catch (error) {
    console.error('❌ Error generating changelog:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateChangelog();
}

module.exports = { generateChangelog };