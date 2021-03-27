import dayjs from 'dayjs';
import {TIME_FORMAT} from '../constant/index';
 
export const formatTime = (time: string | number) => {
  return dayjs(time).format(TIME_FORMAT);
};
