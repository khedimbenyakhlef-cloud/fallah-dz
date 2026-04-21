var fs = require('fs');
var c = fs.readFileSync('frontend/index.html', 'utf8');

// Remove the fallback direct Groq call (it uses null apiKey, always 401)
// Replace the entire catch block in sendChat with a simple error message
c = c.replace(
  /} catch \{\n      \/\/ Fallback: direct Groq API call[\s\S]*?}\n      const data = await res\.json\(\);\n      if \(data\.error\) throw new Error\(data\.error\.message\);\n      reply = data\.choices\?\.\[0\]\?\.message\?\.content \|\| 'عذراً، حاول مرة أخرى\.';\n    \}/,
  "} catch {\n      throw new Error('backend unavailable');\n    }"
);

// Remove the fallback direct Groq call in analyzePlant too
c = c.replace(
  /} catch \{\n        \/\/ Fallback: direct Groq vision API[\s\S]*?result = data\.choices\?\.\[0\]\?\.message\?\.content \|\| 'لم يتمكن من التشخيص\.';\n      \}/,
  "} catch {\n        throw new Error('backend unavailable');\n      }"
);

fs.writeFileSync('frontend/index.html', c, 'utf8');
console.log('frontend fixed!');
