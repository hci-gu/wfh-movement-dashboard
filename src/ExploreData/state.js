import { atom, selector } from 'recoil'
import moment from 'moment'

/*
User fields 
--- automatically collected from app ---
_id (MongoDB id )
appName ( WFH Movement | SFH Movement )
os
dataSource
created ( Date when user was created )

--- user input ---
workedFromHome ( true|false, (first question of the latest version of the app) )
ageRange
education
gender
occupation
stepsEstimate
compareDate ( older version WFH date )
afterPeriods ( array of objects with from|to dates, to being null if it's ongoing )

-- calculated from steps --
stepsBefore ( average daily steps before )
stepsAfter ( average daily steps after )
stepsChange ()
period ( number of days that user has data )
days ( array of all days with number of steps taken on each day )


*/
export const usersAtom = atom({
  key: 'users',
  default: [],
})

export const filtersAtom = atom({
  key: 'filters',
  default: {
    ageRange: null,
    gender: null,
  },
})

export const analysisSettingsAtom = atom({
  key: 'analysis-settings',
  default: {
    includeWeekends: true,
    monthsBefore: 3,
    monthsAfter: 3,
    maxMissingDaysBefore: 0.05,
    maxMissingDaysAfter: 0.05,
    workers: 8,
  },
})

export const analysisAtom = atom({
  key: 'analysis',
  default: [],
})

export const datesAtom = atom({
  key: 'dates',
  default: {
    beforePeriod: {
      value: 3,
      unit: 'Months',
    },
  },
})

export const usersSelector = selector({
  key: 'users-selector',
  get: ({ get }) => {
    const users = get(usersAtom)
    const dates = get(datesAtom)
    const filters = get(filtersAtom)

    return users
      .filter((u) => {
        return Object.keys(filters).every((key) => {
          if (filters[key]) {
            return u[key] === filters[key]
          }
          return true
        })
      })
      .filter((u) => {
        if (dates.beforePeriod.value === 0) return true
        const firstWFHDate = u.compareDate
          ? u.compareDate
          : u.afterPeriods && u.afterPeriods[0]
          ? u.afterPeriods[0].from
          : moment().format()
        const value = moment(firstWFHDate).diff(
          u.initialDataDate,
          dates.beforePeriod.unit
        )

        return value > dates.beforePeriod.value
      })
  },
})

export const userDatesSelector = selector({
  key: 'user-dates',
  get: ({ get }) => {
    const users = get(usersSelector)
    const [min, max] = get(minMaxDatesSelector)
    const days = moment(max).diff(min, 'days')
    const entireUserDataPeriod = Array.from({ length: days })
      .map((_, i) => i)
      .reduce((acc, i) => {
        const date = moment(min).add(i, 'days').format('YYYY-MM-DD')
        acc[date] = 0
        return acc
      }, {})

    const datesMap = {
      initalDataDate: { ...entireUserDataPeriod },
      wfhDate: { ...entireUserDataPeriod },
      created: { ...entireUserDataPeriod },
    }

    users.forEach((u) => {
      const initalDataDate = moment(u.initialDataDate).format('YYYY-MM-DD')
      datesMap.initalDataDate[initalDataDate]++
      const created = moment(u.created).format('YYYY-MM-DD')
      datesMap.created[created]++
      const firstWFHDate = u.compareDate
        ? u.compareDate
        : u.afterPeriods && u.afterPeriods[0]
        ? u.afterPeriods[0].from
        : null

      if (firstWFHDate) {
        const wfhDate = moment(firstWFHDate).format('YYYY-MM-DD')
        datesMap.wfhDate[wfhDate]++
      }
    })

    return [
      ...Object.keys(datesMap.initalDataDate).map((date) => {
        return {
          date,
          value: datesMap.initalDataDate[date],
          type: 'initialDataDate',
        }
      }),
      ...Object.keys(datesMap.created).map((date) => {
        return {
          date,
          value: datesMap.created[date],
          type: 'created',
        }
      }),
      ...Object.keys(datesMap.wfhDate).map((date) => {
        return {
          date,
          value: datesMap.wfhDate[date],
          type: 'wfhDate',
        }
      }),
    ]
  },
})

export const minMaxDatesSelector = selector({
  key: 'min-max-dates',
  get: ({ get }) => {
    const users = get(usersSelector)

    let minDate = new Date()
    let maxDate = new Date()

    users.forEach((u) => {
      if (u.initialDataDate && moment(u.initialDataDate).isBefore(minDate)) {
        minDate = u.initialDataDate
      }
    })

    return [minDate, maxDate]
  },
})
