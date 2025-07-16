export function formatText(text = ''): string {
  if (!text) return '';

  const lowercaseWords = ['de', 'y', 'en', 'a', 'con', 'por', 'para', 'el', 'la', 'los', 'las', 'del', 'al'];

  const acronymRegex = /\b([A-Z]\.)+[A-Z]?\b/g;

  return text
    .toLowerCase() 
    .replace(acronymRegex, match => match.toUpperCase())
    .split(' ') 
    .map((word, index) => {
      if (word.match(acronymRegex)) {
        return word;
      }
      if (index === 0 || !lowercaseWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}