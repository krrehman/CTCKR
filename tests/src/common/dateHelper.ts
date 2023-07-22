import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

export const getDaysFromNow = (count = 3) => dayjs().add(count, 'day').format('dddd DD MMMM')

export const formatDateMessage = (day: string) => dayjs(day).format('Do MMMM')
