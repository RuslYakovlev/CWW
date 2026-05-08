import { Sermon } from '../types';

export const isPublicSermon = (sermon: Sermon) => {
  return !/прямая трансляция|live stream|livestream/i.test(sermon.title);
};
