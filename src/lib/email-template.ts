export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function brandedEmail({
  preheader,
  heading,
  bodyHtml,
  ctaText,
  ctaLink,
}: {
  preheader?: string;
  heading: string;
  bodyHtml: string; // caller must escape any user-supplied values before building this
  ctaText?: string;
  ctaLink?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Elan Innovate</title>
</head>
<body style="margin:0; padding:0; background-color:#FFFFFC; font-family: Arial, Helvetica, sans-serif;">
  ${preheader ? `<div style="display:none; max-height:0; overflow:hidden;">${escapeHtml(preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; border: 4px solid #000000;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#000000; padding: 24px 32px;">
              <span style="color:#FF6A00; font-weight: 900; font-size: 22px; letter-spacing: 1px; text-transform: uppercase; font-family: Arial, Helvetica, sans-serif;">
                Elan Innovate
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 900; text-transform: uppercase; color: #000000; line-height: 1.2;">
                ${escapeHtml(heading)}
              </h1>
              <div style="font-size: 15px; line-height: 1.6; color: #000000;">
                ${bodyHtml}
              </div>
              ${
                ctaText && ctaLink
                  ? `
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 28px;">
                <tr>
                  <td style="background-color:#FF6A00;">
                    <a href="${ctaLink}" target="_blank" style="display:inline-block; padding: 14px 28px; color:#FFFFFC; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; font-size: 14px;">
                      ${escapeHtml(ctaText)}
                    </a>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background-color:#000000; padding: 20px 32px;">
              <p style="margin:0; color:#FFFFFC; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                Building with Momentum
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}