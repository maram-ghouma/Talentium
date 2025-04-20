import { format, isToday, isTomorrow } from 'date-fns';

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy - h:mm a');
  }
};