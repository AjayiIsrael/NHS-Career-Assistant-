/**
 * Produce a Word-openable document from plain text without any dependency.
 * We emit an HTML document with a .doc extension — Word opens this natively
 * and it keeps basic formatting (headings, paragraphs).
 */
export function downloadWordDoc(filename, title, sections) {
  const body = sections
    .map(
      (s) =>
        `<h2 style="font-family:Calibri,Arial,sans-serif;color:#003087;">${escapeHtml(
          s.heading,
        )}</h2>` +
        `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;white-space:pre-wrap;">${escapeHtml(
          s.body,
        )}</p>`,
    )
    .join('\n')

  const html =
    `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" ` +
    `xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">` +
    `<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>` +
    `<body><h1 style="font-family:Calibri,Arial,sans-serif;color:#005EB8;">${escapeHtml(
      title,
    )}</h1>${body}</body></html>`

  const blob = new Blob(['﻿', html], { type: 'application/msword' })
  triggerDownload(blob, filename.endsWith('.doc') ? filename : `${filename}.doc`)
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, filename)
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
