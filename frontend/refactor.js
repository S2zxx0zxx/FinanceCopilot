const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find import { ... } from "@/lib/data"
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']@\/lib\/data["'];?/g;
    const match = importRegex.exec(content);
    
    if (!match) return; // No data import
    
    let vars = match[1].split(',').map(s => s.trim()).filter(s => s);
    let importedVars = vars.filter(s => !s.startsWith('type '));
    let typeVars = vars.filter(s => s.startsWith('type '));
    
    if (importedVars.length === 0) {
        // Only types imported, just replace the path or leave it
        return; 
    }
    
    let hookCall = `  const { ${importedVars.join(', ')} } = useAppData();`;
    
    // Replace import
    let newImport = `import { useAppData } from "@/hooks/use-app-data";\n`;
    if (typeVars.length > 0) {
        newImport += `import { ${typeVars.join(', ')} } from "@/lib/data";\n`;
    }
    
    content = content.replace(match[0], newImport);
    
    // Inject hook inside the main exported function
    // Look for: export default function Something(...) {
    const defaultExportRegex = /export\s+default\s+(?:async\s+)?function\s+[a-zA-Z0-9_]*\s*\([^)]*\)\s*\{/g;
    const defaultMatch = defaultExportRegex.exec(content);
    
    if (defaultMatch) {
        const injectIndex = defaultMatch.index + defaultMatch[0].length;
        content = content.slice(0, injectIndex) + '\n' + hookCall + content.slice(injectIndex);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log("Refactored:", filePath);
    } else {
        // Look for: const Something = (...) => { ... export default Something;
        const arrowRegex = /const\s+[a-zA-Z0-9_]+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/g;
        const arrowMatch = arrowRegex.exec(content);
        if (arrowMatch) {
            const injectIndex = arrowMatch.index + arrowMatch[0].length;
            content = content.slice(0, injectIndex) + '\n' + hookCall + content.slice(injectIndex);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log("Refactored (arrow):", filePath);
        } else {
            console.log("Could not find injection point in", filePath);
        }
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            walk(file);
        } else if (file.endsWith('.tsx')) {
            processFile(file);
        }
    });
}

walk(path.join(__dirname, 'src/app'));
