export function baseTemplate(content: string, options?: { previewText?: string }): string {
  const previewText = options?.previewText || ''

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>MK Immobilien</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 3px solid #1e3a5f;
    }
    .header {
      background-color: #ffffff;
      padding: 24px;
      text-align: center;
      border-bottom: 2px solid #1e3a5f;
    }
    .header img {
      max-height: 40px;
      width: auto;
    }
    .header-text {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
    .content {
      padding: 32px 24px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #1e3a5f;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #1e3a5f;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 16px 0;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 24px 0;
    }
    .preview-text {
      display: none;
      max-height: 0;
      overflow: hidden;
    }
    p {
      margin: 0 0 16px 0;
    }
  </style>
</head>
<body>
  <!-- Preview Text -->
  ${previewText ? `<div class="preview-text">${previewText}</div>` : ''}

  <div class="container">
    <div class="card">
      <!-- Header -->
      <div class="header">
        <img src="https://moellerknabe.de/images/logomk.png" alt="MK Immobilien" style="max-height: 50px; width: auto;">
      </div>

      <!-- Content -->
      <div class="content">
        ${content}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin-bottom: 8px;">
          <strong>Möller & Knabe GbR</strong>
        </p>
        <p style="margin-bottom: 8px;">
          Gräserstr. 6, 52249 Eschweiler
        </p>
        <p style="margin-bottom: 8px;">
          <a href="tel:+4924031234">+49 (0) 2403 1234</a> |
          <a href="mailto:mail@moellerknabe.de">mail@moellerknabe.de</a>
        </p>
        <p style="margin-bottom: 0;">
          <a href="https://moellerknabe.de">www.moellerknabe.de</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`
}
