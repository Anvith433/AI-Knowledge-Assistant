export const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatTime = (date) =>
  date ? new Date(date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export const dayLabel = (date) => {
  if (!date) return 'Earlier';
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(new Date(date))) / 86400000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return 'This week';
  return 'Earlier';
};

export const relativeDay = (date) => {
  const label = dayLabel(date);
  return label === 'Today' || label === 'Yesterday' ? label : formatDate(date);
};

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Burning the midnight oil';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const firstName = (fullName = '') => fullName.trim().split(/\s+/)[0] || 'there';
