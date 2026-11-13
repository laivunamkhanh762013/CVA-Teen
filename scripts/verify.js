const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

function getHash(filePath) {
  const content = fs.readFileSync(filePath);
  return {
    hash: crypto.createHash('sha256').update(content).digest('hex'),
    size: content.length,
    buffer: content
  };
}

function verifyFiles() {
  console.log('=== 1. BYTE PARITY VERIFICATION ===');
  const indexInfo = getHash('index.html');
  const tramInfo = getHash('Tram_Hoc_Duong_Teen.html');

  console.log(`index.html: ${indexInfo.size} bytes, SHA256: ${indexInfo.hash}`);
  console.log(`Tram_Hoc_Duong_Teen.html: ${tramInfo.size} bytes, SHA256: ${tramInfo.hash}`);

  const identical = indexInfo.hash === tramInfo.hash;
  console.log(`Byte parity identical: ${identical ? 'PASS ✅' : 'FAIL ❌'}`);
  if (!identical) {
    console.log(`Size diff: ${indexInfo.size - tramInfo.size} bytes`);
  }

  const html = fs.readFileSync('index.html', 'utf-8');

  console.log('\n=== 2. EXTRACT & SYNTAX CHECK JAVASCRIPT ===');
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;
  let totalSyntaxErrors = 0;
  const scriptBodies = [];

  while ((match = scriptRegex.exec(html)) !== null) {
    const attrs = match[1];
    const code = match[2].trim();
    if (!code) continue; // external src or empty

    // ignore ld+json or template scripts
    if (/type=["'](application\/ld\+json|text\/template|text\/html)["']/i.test(attrs)) {
      continue;
    }

    scriptIndex++;
    console.log(`Checking script #${scriptIndex} (length: ${code.length} chars)...`);
    try {
      new vm.Script(code, { filename: `script_${scriptIndex}.js` });
      console.log(`  Script #${scriptIndex}: SYNTAX OK ✅`);
      scriptBodies.push(code);
    } catch (err) {
      totalSyntaxErrors++;
      console.error(`  Script #${scriptIndex}: SYNTAX ERROR ❌`, err.message);
      if (err.stack) console.error(err.stack.split('\n').slice(0, 5).join('\n'));
    }
  }

  console.log(`Total inline scripts checked: ${scriptIndex}, syntax errors: ${totalSyntaxErrors}`);

  console.log('\n=== 3. DOM IDs & REFERENCES VERIFICATION ===');
  // Find all defined IDs in HTML
  const definedIds = new Set();
  const idRegex = /\bid=["']([a-zA-Z0-9_\-:]+)["']/g;
  let idMatch;
  while ((idMatch = idRegex.exec(html)) !== null) {
    definedIds.add(idMatch[1]);
  }
  console.log(`Total unique IDs defined in HTML: ${definedIds.size}`);

  // Find all referenced IDs in scripts (getElementById, querySelector('#...'))
  const referencedIds = new Set();
  const allScriptCode = scriptBodies.join('\n');

  const getElemRegex = /getElementById\(\s*['"`]([a-zA-Z0-9_\-:]+)['"`]\s*\)/g;
  let getElemMatch;
  while ((getElemMatch = getElemRegex.exec(allScriptCode)) !== null) {
    referencedIds.add({ id: getElemMatch[1], type: 'getElementById' });
  }

  const queryIdRegex = /querySelector(?:All)?\(\s*['"`]#([a-zA-Z0-9_\-:]+)['"`]\s*\)/g;
  let queryIdMatch;
  while ((queryIdMatch = queryIdRegex.exec(allScriptCode)) !== null) {
    referencedIds.add({ id: queryIdMatch[1], type: 'querySelector' });
  }

  console.log(`Total unique ID references scanned in JS: ${referencedIds.size}`);
  let missingIds = 0;
  for (const ref of referencedIds) {
    if (!definedIds.has(ref.id)) {
      // Some dynamic IDs might be created at runtime, let's flag them
      console.warn(`  [MISSING DOM ID] Referenced ID "${ref.id}" via ${ref.type} not found in static HTML!`);
      missingIds++;
    }
  }
  if (missingIds === 0) {
    console.log('All referenced DOM IDs exist in static HTML! ✅');
  } else {
    console.log(`Found ${missingIds} missing DOM IDs (some may be dynamically generated).`);
  }

  console.log('\n=== 4. ONCLICK / EVENT HANDLERS VERIFICATION ===');
  // Find all inline event handlers (onclick, onchange, onsubmit, oninput, etc.)
  const handlerRegex = /\b(on[a-z]+)=["']([^"']+)["']/gi;
  let handlerMatch;
  const handlersFound = [];
  while ((handlerMatch = handlerRegex.exec(html)) !== null) {
    handlersFound.push({
      attr: handlerMatch[1],
      code: handlerMatch[2]
    });
  }
  console.log(`Total inline event handlers found: ${handlersFound.length}`);

  // Extract function calls from handlers, e.g., "switchTab('feed')", "votePoll(1)", "toggleLike(this)"
  const funcCallRegex = /\b([a-zA-Z0-9_$]+)\s*\(/g;
  const calledFunctions = new Set();
  for (const h of handlersFound) {
    let callMatch;
    while ((callMatch = funcCallRegex.exec(h.code)) !== null) {
      const fn = callMatch[1];
      // ignore built-ins or common keywords & native DOM APIs
      if (!['if', 'for', 'while', 'switch', 'console', 'alert', 'confirm', 'prompt', 'event', 'Date', 'parseInt', 'parseFloat', 'String', 'Number', 'Boolean', 'Array', 'Object', 'Math', 'JSON', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'stopPropagation', 'preventDefault', 'getElementById', 'querySelector', 'querySelectorAll', 'click', 'focus', 'submit', 'reset'].includes(fn)) {
        calledFunctions.add(fn);
      }
    }
  }

  console.log(`Scanned ${calledFunctions.size} unique functions invoked in HTML event handlers:`);
  console.log(Array.from(calledFunctions).join(', '));

  // Check if functions are defined in the scripts
  let missingFuncs = 0;
  for (const fn of calledFunctions) {
    // Check patterns: function fn, window.fn =, fn = function, fn = () =>, const fn =, let fn =, var fn =
    const fnDefRegex = new RegExp(`(?:function\\s+${fn}\\b|(?:window\\.)?${fn}\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>)|(?:const|let|var)\\s+${fn}\\s*=)`, 'g');
    if (!fnDefRegex.test(allScriptCode)) {
      console.warn(`  [MISSING FUNCTION] "${fn}" called in HTML handler is not explicitly defined in scripts!`);
      missingFuncs++;
    }
  }
  if (missingFuncs === 0) {
    console.log('All called event handler functions are defined in JS! ✅');
  } else {
    console.log(`Found ${missingFuncs} missing functions called by HTML event handlers!`);
  }
}

verifyFiles();
