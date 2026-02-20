const fs = require('fs');
const path = require('path');

function replaceInDir(dir, findRegex, replaceStr) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            replaceInDir(filePath, findRegex, replaceStr);
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
            let content = fs.readFileSync(filePath, 'utf-8');
            if (findRegex.test(content)) {
                content = content.replace(findRegex, replaceStr);
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`Updated: ${filePath}`);
            }
        }
    }
}

const dirToSearch = path.join(__dirname, 'apps/web/src');
const prismaRegex = /from\s+['"]@prisma\/client['"]/g;
const replacement = "from '@ais/db'";

console.log('Starting replacement...');
replaceInDir(dirToSearch, prismaRegex, replacement);
console.log('Done.');
