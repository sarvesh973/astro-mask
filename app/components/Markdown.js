/* A deliberately small markdown subset - headings, bold, italic, bullets and
   quotes. Enough for the reading, and it streams cleanly chunk by chunk
   without pulling in a parser. Text is rendered as text, never as HTML. */

function inline(text, keyBase) {
  const nodes = [];
  // **bold** | *italic* | _italic_
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_)/g;
  let last = 0;
  let m;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-i${i++}`;
    if (tok.startsWith("**")) {
      nodes.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function Markdown({ text }) {
  const lines = String(text || "").split("\n");
  const out = [];
  let list = null;
  let i = 0;

  const flushList = () => {
    if (list) {
      out.push(<ul key={`ul-${i}`}>{list}</ul>);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    i++;

    if (!line.trim()) { flushList(); continue; }

    const h = line.match(/^#{1,4}\s+(.*)$/);
    if (h) {
      flushList();
      out.push(<h3 key={`h-${i}`}>{inline(h[1], `h${i}`)}</h3>);
      continue;
    }

    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      list ??= [];
      list.push(<li key={`li-${i}`}>{inline(bullet[1], `l${i}`)}</li>);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushList();
      out.push(<blockquote key={`q-${i}`}>{inline(quote[1], `q${i}`)}</blockquote>);
      continue;
    }

    flushList();
    out.push(<p key={`p-${i}`}>{inline(line, `p${i}`)}</p>);
  }
  flushList();

  return <>{out}</>;
}
