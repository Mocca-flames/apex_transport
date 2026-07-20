const fs = require('fs');
const path = require('path');

const root = __dirname;
const desktop = JSON.parse(fs.readFileSync(path.join(root, 'data/content.json'), 'utf8'));
const mobile = JSON.parse(fs.readFileSync(path.join(root, 'data/content_mobile.json'), 'utf8'));

const pages = [
  'index.html',
  'services.html',
  'border-clearance.html',
  'fleet.html',
  'contact.html',
  'about.html',
  'consolidation-loads.html'
];

function getValue(obj, path) {
  if (!obj || !path) return undefined;

  return path.split('.').reduce(function(current, part) {
    if (current === undefined || current === null) return undefined;

    const match = part.match(/^([a-zA-Z0-9_-]+)\[(\d+)\]$/);
    if (match) {
      const key = match[1];
      const idx = Number(match[2]);
      if (!Array.isArray(current[key]) || idx >= current[key].length) return undefined;
      return current[key][idx];
    }

    return current[part];
  }, obj);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanAttributes(attrs) {
  return attrs
    .replace(/\s*data-content(?:-html|-attr)?="[^"]*"/g, '')
    .replace(/\s*data-swap-mobile(?:-html)?="[^"]*"/g, '')
    .replace(/\s+\w+=""/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function rewriteTag(tag, attrs, body, path) {
  const desktopVal = getValue(desktop, path);
  if (desktopVal === undefined) return null;

  const mobileVal = getValue(mobile, path);
  const attrTarget = /data-content-attr="([^"]+)"/.exec(attrs);
  const htmlMode = /data-content-html/.test(attrs);
  const cleaned = cleanAttributes(attrs);

  let output = '<' + tag;
  if (cleaned) output += ' ' + cleaned;

  if (attrTarget && attrTarget[1]) {
    output += ' ' + attrTarget[1] + '="' + escapeAttribute(desktopVal) + '"';
    return output + '>' + body + '</' + tag + '>';
  }

  if (mobileVal !== undefined && String(mobileVal) !== String(desktopVal)) {
    output += ' ' + (htmlMode ? 'data-swap-mobile-html' : 'data-swap-mobile') + '="' + escapeAttribute(mobileVal) + '"';
  }

  const text = htmlMode ? String(desktopVal) : escapeHtml(desktopVal);
  return output + '>' + text + '</' + tag + '>';
}

function rewriteSelfClosing(tag, attrs, path) {
  const desktopVal = getValue(desktop, path);
  if (desktopVal === undefined) return null;

  const mobileVal = getValue(mobile, path);
  const attrTarget = /data-content-attr="([^"]+)"/.exec(attrs);
  const cleaned = cleanAttributes(attrs);

  let output = '<' + tag;
  if (cleaned) output += ' ' + cleaned;

  if (attrTarget && attrTarget[1]) {
    output += ' ' + attrTarget[1] + '="' + escapeAttribute(desktopVal) + '"';
    return output + ' />';
  }

  if (mobileVal !== undefined && String(mobileVal) !== String(desktopVal)) {
    output += ' data-swap-mobile="' + escapeAttribute(mobileVal) + '"';
  }

  return output + ' />';
}

function bakeHtml(html) {
  const blockPattern = /<([a-zA-Z0-9-]+)([^>]*)data-content="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g;
  const selfClosingPattern = /<([a-zA-Z0-9-]+)([^>]*)data-content="([^"]+)"([^>]*)\/>/g;
  const openingPattern = /<([a-zA-Z0-9-]+)([^>]*)data-content="([^"]+)"([^>]*)>/g;

  html = html.replace(blockPattern, function(match, tag, before, path, after, innerText) {
    return rewriteTag(tag, before + after, innerText, path) || match;
  });

  html = html.replace(selfClosingPattern, function(match, tag, before, path, after) {
    return rewriteSelfClosing(tag, before + after, path) || match;
  });

  html = html.replace(openingPattern, function(match, tag, before, path, after) {
    const desktopVal = getValue(desktop, path);
    if (desktopVal === undefined) return match;

    const mobileVal = getValue(mobile, path);
    const attrTarget = /data-content-attr="([^"]+)"/.exec(before + after);
    const cleaned = cleanAttributes(before + after);

    let output = '<' + tag;
    if (cleaned) output += ' ' + cleaned;

    if (attrTarget && attrTarget[1]) {
      output += ' ' + attrTarget[1] + '="' + escapeAttribute(desktopVal) + '"';
    }

    if (mobileVal !== undefined && String(mobileVal) !== String(desktopVal) && !attrTarget) {
      output += ' data-swap-mobile="' + escapeAttribute(mobileVal) + '"';
    }

    return output + '>';
  });

  html = html.replace(/\s*data-content(?:-html|-attr)?="[^"]*"/g, '');
  html = html.replace(/\s*data-swap-mobile(?:-html)?="[^"]*"/g, '');

  html = html.replace(/<script>[\s\S]*?window\.__APEX_CONTENT__[\s\S]*?<\/script>/g, '');

  return html.replace(/<\/head>/i, [
    '<script>',
    'window.__APEX_CONTENT__ = ' + JSON.stringify(desktop) + ';',
    'window.__APEX_CONTENT_MOBILE__ = ' + JSON.stringify(mobile) + ';',
    '</script>',
    '<script>',
    '(function(){',
    '  if (!window.matchMedia("(max-width: 1024px)").matches) return;',
    '  document.querySelectorAll("[data-swap-mobile]").forEach(function(el){',
    '    el.textContent = el.getAttribute("data-swap-mobile");',
    '  });',
    '  document.querySelectorAll("[data-swap-mobile-html]").forEach(function(el){',
    '    el.innerHTML = el.getAttribute("data-swap-mobile-html");',
    '  });',
    '})();',
    '</script>'
  ].join('\n') + '\n</head>');
}

pages.forEach(function(page) {
  const target = path.join(root, page);
  const html = fs.readFileSync(target, 'utf8');
  const baked = bakeHtml(html);
  fs.writeFileSync(target, baked);
  console.log('Baked:', page);
});

console.log('Build complete:', pages.length, 'files updated.');
