export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export interface CronField {
  name: string
  value: string
  explanation: string
  range: string
}

export const getMonthName = (month: string): string => {
  if (month === '*') return 'every month'
  const monthNum = parseInt(month)
  if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
    return MONTHS[monthNum - 1].toLowerCase()
  }
  return month.toLowerCase()
}

export const getMonthRangeOrList = (monthStr: string): string => {
  if (monthStr.includes('-')) {
    const [start, end] = monthStr.split('-').map((m) => getMonthName(m))
    return `${start} through ${end}`
  }
  if (monthStr.includes(',')) {
    const months = monthStr.split(',').map((m) => getMonthName(m))
    return months.length === 2
      ? `${months[0]} and ${months[1]}`
      : months.slice(0, -1).join(', ') + ', and ' + months.slice(-1)
  }
  return getMonthName(monthStr)
}

export const getDayName = (day: string): string => {
  if (day === '*') return 'every day'
  const dayNum = parseInt(day)
  if (!isNaN(dayNum) && dayNum >= 0 && dayNum <= 6) {
    return DAYS_OF_WEEK[dayNum].toLowerCase()
  }
  return day.toLowerCase()
}

export const getDayRangeOrList = (dayStr: string): string => {
  if (dayStr.includes('-')) {
    const [start, end] = dayStr.split('-').map((d) => getDayName(d))
    return `${start} through ${end}`
  }
  if (dayStr.includes(',')) {
    const days = dayStr.split(',').map((d) => getDayName(d))
    return days.length === 2
      ? `${days[0]} and ${days[1]}`
      : days.slice(0, -1).join(', ') + ', and ' + days.slice(-1)
  }
  return getDayName(dayStr)
}

export const getMinuteExpression = (minute: string): string => {
  if (minute === '*') return 'every minute'
  if (minute.includes('/')) {
    const [_, interval] = minute.split('/')
    return `every ${interval} minutes`
  }
  if (minute.includes('-')) {
    const [start, end] = minute.split('-')
    return `every minute from ${start} through ${end}`
  }
  if (minute.includes(',')) {
    const minutes = minute.split(',')
    return minutes.length === 2
      ? `at minutes ${minutes[0]} and ${minutes[1]}`
      : `at minutes ${minutes.slice(0, -1).join(', ')}, and ${minutes.slice(-1)}`
  }
  return `at minute ${minute}`
}

export const formatHour = (hourNum: number): string => {
  const period = hourNum >= 12 ? 'PM' : 'AM'
  const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
  return `${hour12}:00 ${period}`
}

export const getHourExpression = (hour: string): string => {
  if (hour === '*') return 'every hour'
  if (hour.includes('/')) {
    const [_, interval] = hour.split('/')
    return `every ${interval} hours`
  }
  if (hour.includes('-')) {
    const [start, end] = hour.split('-').map((h) => {
      const hourNum = parseInt(h)
      return formatHour(hourNum)
    })
    return `every hour from ${start} through ${end}`
  }
  if (hour.includes(',')) {
    const hours = hour.split(',').map((h) => {
      const hourNum = parseInt(h)
      return formatHour(hourNum)
    })
    return hours.length === 2
      ? `at ${hours[0]} and ${hours[1]}`
      : `at ${hours.slice(0, -1).join(', ')}, and ${hours.slice(-1)}`
  }
  const hourNum = parseInt(hour)
  if (!isNaN(hourNum)) {
    return `at ${formatHour(hourNum)}`
  }
  return `at hour ${hour}`
}

export const getOrdinalSuffix = (num: number): string =>
  ['th', 'st', 'nd', 'rd'][
    num % 10 > 3 ? 0 : ((num % 100) - 20) % 10 < 4 ? num % 10 : 0
  ]

export const getDayOfMonthExpression = (day: string): string => {
  if (day === '*') return 'every day'
  if (day.includes('/')) {
    const [_, interval] = day.split('/')
    return `every ${interval} days`
  }
  if (day.includes('-')) {
    const [start, end] = day.split('-').map((d) => {
      const dayNum = parseInt(d)
      const suffix = getOrdinalSuffix(dayNum)
      return `${dayNum}${suffix}`
    })
    return `from the ${start} through the ${end}`
  }
  if (day.includes(',')) {
    const days = day.split(',').map((d) => {
      const dayNum = parseInt(d)
      const suffix = getOrdinalSuffix(dayNum)
      return `${dayNum}${suffix}`
    })
    return days.length === 2
      ? `on the ${days[0]} and ${days[1]}`
      : `on the ${days.slice(0, -1).join(', ')}, and ${days.slice(-1)}`
  }
  const dayNum = parseInt(day)
  if (!isNaN(dayNum)) {
    const suffix = getOrdinalSuffix(dayNum)
    return `on the ${dayNum}${suffix}`
  }
  return `on day ${day}`
}

export const parseCron = (
  cron: string
): { fields: CronField[]; humanReadable: string } => {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) {
    return { fields: [], humanReadable: '' }
  }

  const [minute, hour, dayMonth, month, dayWeek] = parts

  const fields = [
    {
      name: 'Minute',
      value: minute,
      explanation: getMinuteExpression(minute),
      range: '0-59',
    },
    {
      name: 'Hour',
      value: hour,
      explanation: getHourExpression(hour),
      range: '0-23',
    },
    {
      name: 'Day of Month',
      value: dayMonth,
      explanation: getDayOfMonthExpression(dayMonth),
      range: '1-31',
    },
    {
      name: 'Month',
      value: month,
      explanation: `in ${getMonthRangeOrList(month)}`,
      range: '1-12 or JAN-DEC',
    },
    {
      name: 'Day of Week',
      value: dayWeek,
      explanation: `on ${getDayRangeOrList(dayWeek)}`,
      range: '0-6 or SUN-SAT (0=Sunday)',
    },
  ]

  // Create human readable string
  const timeStr = `Runs ${getMinuteExpression(minute)} ${getHourExpression(hour)}`
  const dateStr =
    dayMonth === '*' && dayWeek === '*'
      ? 'every day'
      : dayMonth === '*'
        ? `every ${getDayRangeOrList(dayWeek)}`
        : dayWeek === '*'
          ? getDayOfMonthExpression(dayMonth)
          : `${getDayOfMonthExpression(dayMonth)} and on ${getDayRangeOrList(dayWeek)}`
  const monthStr =
    month === '*' ? 'every month' : `in ${getMonthRangeOrList(month)}`

  const humanReadable = `${timeStr}, ${dateStr}, ${monthStr}`

  return { fields, humanReadable }
}
