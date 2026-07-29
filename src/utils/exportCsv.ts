export const exportToCsv = <T extends object>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
) => {
  if (!rows || !rows.length) return;

  const keys = headers ? headers.map((h) => h.key) : (Object.keys(rows[0]) as (keyof T)[]);
  const headerLabels = headers ? headers.map((h) => h.label) : keys.map(String);

  const csvContent = [
    headerLabels.map((label) => `"${label}"`).join(','),
    ...rows.map((row) =>
      keys
        .map((key) => {
          const val = row[key];
          let stringValue = '';

          if (val !== null && val !== undefined) {
            stringValue = typeof val === 'object' ? JSON.stringify(val) : String(val);
          }

          return `"${stringValue.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};