import moment from 'moment'
// eslint-disable-next-line no-restricted-globals
const ctx = self

const createBeforeAndAfterDays = (
  users,
  { monthsBefore = 3, monthsAfter = 3 } = {}
) =>
  users.map((user) => {
    const compareDate = user.compareDate
    const days = user.days

    const daysBefore = days.filter(
      ({ date }) =>
        new Date(date) < new Date(compareDate) &&
        moment(date).isAfter(
          moment(compareDate).subtract(monthsBefore, 'months')
        )
    )
    const daysAfter = days.filter(
      ({ date }) =>
        new Date(date) >= new Date(compareDate) &&
        moment(date).isBefore(moment(compareDate).add(monthsAfter, 'months'))
    )

    return {
      ...user,
      daysBefore,
      daysAfter,
    }
  })

ctx.addEventListener('message', (event) => {
  console.log('worker got data', event.data.length)
  const { users, params } = event.data

  ctx.postMessage(createBeforeAndAfterDays(users, params))
})
