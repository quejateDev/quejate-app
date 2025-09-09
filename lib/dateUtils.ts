export function formatDate(date: Date | string): string {
  const validDate = new Date(date);
  const colombiaTime = new Date(validDate.getTime() - (5 * 60 * 60 * 1000));
  
  const year = colombiaTime.getUTCFullYear();
  const month = String(colombiaTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(colombiaTime.getUTCDate()).padStart(2, '0');
  
  let hours = colombiaTime.getUTCHours();
  const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');
  const minutes = String(colombiaTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(colombiaTime.getUTCSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year}, ${strHours}:${minutes}:${seconds} ${ampm}`;
}

export function formatDateWithoutTime(date: Date | string): string {
  return new Date(date).toLocaleString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}