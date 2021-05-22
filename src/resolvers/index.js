import pkg from 'lodash';

const { merge } = pkg;

import noteResolver from './noteResolver.js';
import userResolver from './userResolver.js';

export default merge(
  noteResolver,
  userResolver,
);
