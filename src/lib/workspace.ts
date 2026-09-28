export const exportToDocs = async (accessToken: string, title: string, content: string) => {
  // 1. Create a new document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  const doc = await createRes.json();
  const documentId = doc.documentId;

  // 2. Insert text into the document
  await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: content,
          },
        },
      ],
    }),
  });

  return `https://docs.google.com/document/d/${documentId}/edit`;
};

export const logToSheets = async (accessToken: string, spreadsheetId: string | null, data: any[]) => {
  let targetId = spreadsheetId;

  // 1. Create spreadsheet if it doesn't exist
  if (!targetId) {
    const createRes = await fetch('https://sheets.googleapis.com/v1/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { title: 'Peer Support Simulator - Training Log' },
      }),
    });
    const sheet = await createRes.json();
    targetId = sheet.spreadsheetId;

    // Add headers
    await fetch(`https://sheets.googleapis.com/v1/spreadsheets/${targetId}/values/Sheet1!A1:F1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [['Date', 'Persona', 'OARS', 'Active Listening', 'CBT', 'De-escalation']],
      }),
    });
  }

  // 2. Append data
  await fetch(`https://sheets.googleapis.com/v1/spreadsheets/${targetId}/values/Sheet1!A:F:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [data],
    }),
  });

  return targetId;
};
