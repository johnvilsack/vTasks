
export const getWeekOfYear = (dateString: string): { week: number; year: number } => {
  const date = new Date(dateString);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Sunday is 0, make it 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // Move to Thursday of the week
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
};

export const getWeekDates = (weekNumber: number, year: number): { start: Date; end: Date } => {
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  // Adjust for the fact that getUTCDay() returns 0 for Sunday
  let firstDayOfYearDayNum = firstDayOfYear.getUTCDay();
  if (firstDayOfYearDayNum === 0) firstDayOfYearDayNum = 7; // Treat Sunday as 7th day for Monday start
  
  // Calculate days to the Monday of the first week
  let daysToFirstMonday = 1 - firstDayOfYearDayNum;
  if (firstDayOfYearDayNum > 4) { // If Jan 1st is Fri, Sat, Sun, then week 1 starts next Mon
      daysToFirstMonday += 7;
  }

  const daysToTargetMonday = daysToFirstMonday + (weekNumber - 1) * 7;
  
  const startDate = new Date(Date.UTC(year, 0, 1 + daysToTargetMonday));
  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 6);
  return { start: startDate, end: endDate };
};


export const formatWeekDateRange = (dateStringInput: string): string => {
  const { week, year } = getWeekOfYear(dateStringInput);
  const { start, end } = getWeekDates(week, year);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  const startStr = start.toLocaleDateString(undefined, options);
  const endStr = end.toLocaleDateString(undefined, options);
  return `(${startStr} - ${endStr})`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatDueDate = (dateString?: string): string => {
  if (!dateString) return '';
  // Check if dateString is just YYYY-MM-DD
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
       return date.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC', // Ensure consistency as input is date only
      });
  }
  // If it's a full ISO string, parse it normally
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString?: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatArchivedAtDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Quick Snooze Date Calculation Utilities

export const getLaterTodayDate = (): Date => {
  const now = new Date();
  now.setHours(now.getHours() + 4);
  return now;
};

export const getTomorrowDate = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0); // 8:00 AM
  return tomorrow;
};

export const getThisWeekendSnoozeDate = (): Date => {
  const now = new Date();
  const currentDay = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const friday = 5;
  let daysUntilFriday = friday - currentDay;

  if (currentDay > friday || (currentDay === friday && now.getHours() >= 17)) { // If it's past Friday 5 PM or weekend
    daysUntilFriday += 7; // Go to next week's Friday
  }

  const snoozeDate = new Date(now);
  snoozeDate.setDate(now.getDate() + daysUntilFriday);
  snoozeDate.setHours(17, 0, 0, 0); // Friday 5:00 PM
  return snoozeDate;
};

export const getNextWeekSnoozeDate = (): Date => {
  const now = new Date();
  const currentDay = now.getDay(); // Sunday = 0, Monday = 1, ...
  const monday = 1;
  let daysUntilMonday = (monday - currentDay + 7) % 7;

  if (daysUntilMonday === 0 && now.getHours() >=8) { // If it's Monday but past 8 AM
    daysUntilMonday = 7; // Go to next Monday
  }
  if (daysUntilMonday === 0 && now.getHours() < 8) {
    // It's Monday before 8am, perfect.
  } else if (daysUntilMonday === 0 && currentDay !== monday) { 
    // This case means it was Sunday and daysUntilMonday became 0, so target next Monday
    daysUntilMonday = 7;
  }


  const snoozeDate = new Date(now);
  snoozeDate.setDate(now.getDate() + daysUntilMonday);
  snoozeDate.setHours(8, 0, 0, 0); // Monday 8:00 AM
  return snoozeDate;
};
