import dayjs from 'dayjs';

export const formatTime = (time: string | number) => {
  return dayjs(time).format('YYYY-MM-DD');
};
