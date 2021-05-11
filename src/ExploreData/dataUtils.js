import ttest from 'ttest'
import AnalysisWorker from './analysis.worker.js'

const median = (arr) => arr.sort()[Math.floor(arr.length / 2)]
const mean = (arr) =>
  arr.length === 0 ? 0 : arr.reduce((sum, value) => sum + value, 0) / arr.length

const analyse = (users, { useMedian = true } = {}) => {
  const beforeAfter = users.map(({ daysBefore, daysAfter }) => {
    const f = useMedian ? median : mean
    return [
      f(daysBefore.map(({ value }) => value)),
      f(daysAfter.map(({ value }) => value)),
    ]
  })

  if (
    beforeAfter.some(
      ([a, b]) =>
        Number.isNaN(a) || Number.isNaN(b) || a === undefined || b === undefined
    )
  )
    throw new Error('error in data')

  const diffs = beforeAfter.map(([before, after]) => (after || 0) - before)

  // manual calculation, left to ttest-package
  // const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / medians.length
  // const sdDiff = Math.sqrt(diffs.reduce((sum, diff) => sum + (diff - avgDiff) * (diff - avgDiff), 0) / (medians.length))
  // const t = avgDiff / (sdDiff/Math.sqrt(medians.length))
  // console.log({ avgDiff, sdDiff, t })

  // const test = ttest(medians.map(([x]) => x), medians.map(([,x]) => x))
  const test = ttest(diffs)

  return {
    // avgDiff, sdDiff, t,
    p: test.pValue(),
    testValue: test.testValue(),
    valid: test.valid(),
    freedom: test.freedom(),
    before: mean(beforeAfter.map(([x]) => x)),
    after: mean(beforeAfter.map(([, x]) => x)),
  }
}

function createGroups(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups)
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup))
}

const runWorker = (users, settings) => {
  return new Promise((resolve) => {
    const worker = new AnalysisWorker()
    worker.addEventListener('message', (e) => {
      worker.terminate()
      resolve(e.data)
    })

    worker.postMessage({ users, settings })
  })
}

const runAnalysis = (users, settings) => {
  return new Promise(async (resolve) => {
    const filteredUsers = users.filter(
      ({ compareDate, days }) => compareDate && days && days.length > 0
    )
    const userChunks = createGroups(filteredUsers, settings.workers)
    const processedChunks = await Promise.all(
      userChunks.map((chunk) => runWorker(chunk, settings))
    )
    const dataUsers = processedChunks
      .flat()
      .filter(
        ({ daysBefore, daysAfter }) =>
          daysBefore.filter(({ value }) => value > 0).length /
            daysBefore.length >
          1 - settings.maxMissingDaysBefore
      )
      .filter(
        ({ daysBefore, daysAfter }) =>
          daysAfter.filter(({ value }) => value > 0).length / daysAfter.length >
          1 - settings.maxMissingDaysAfter
      )

    const ages = [
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65-74',
      '75-84',
      // '85-94',
      // '95-104',
    ]
    const all = {
      gender: 'Any',
      ageRange: 'Any',
      ...analyse(dataUsers),
    }
    const allGenders = ages.map((age) => ({
      gender: 'Any',
      ageRange: age,
      ...analyse(dataUsers.filter(({ ageRange }) => ageRange === age)),
    }))
    const allMale = {
      gender: 'Male',
      ageRange: 'all',
      ...analyse(dataUsers.filter(({ gender }) => gender === 'Male')),
    }
    const male = ages.map((age) => ({
      gender: 'Male',
      ageRange: age,
      ...analyse(
        dataUsers.filter(
          ({ ageRange, gender }) => ageRange === age && gender === 'Male'
        )
      ),
    }))
    const allFemale = {
      gender: 'Female',
      ageRange: 'all',
      ...analyse(dataUsers.filter(({ gender }) => gender === 'Female')),
    }
    const female = ages.map((age) => ({
      gender: 'Female',
      ageRange: age,
      ...analyse(
        dataUsers.filter(
          ({ ageRange, gender }) => ageRange === age && gender === 'Female'
        )
      ),
    }))
    resolve([all, ...allGenders, allMale, ...male, allFemale, ...female])
  })
}

export { runAnalysis }
