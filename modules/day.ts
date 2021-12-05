import dayjs from 'dayjs';
import th from 'dayjs/locale/th';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.locale('th', th);
export default dayjs;