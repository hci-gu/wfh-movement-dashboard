import { Select } from 'antd'
import React from 'react'
import { useRecoilState } from 'recoil'
import { filtersAtom } from '../state'

const optionsForKey = (key) => {
  switch (key) {
    case 'ageRange':
      return [
        '18-24',
        '25-34',
        '35-44',
        '45-54',
        '55-64',
        '65-74',
        '75-84',
        '85-94',
        '95-104',
      ]
    case 'gender':
      return ['Male', 'Female']
    default:
      return []
  }
}

const Filter = ({ dataKey }) => {
  const [filters, setFilters] = useRecoilState(filtersAtom)

  const onChange = (value) => {
    setFilters({
      ...filters,
      [dataKey]: value,
    })
  }

  return (
    <Select onChange={onChange} placeholder={`Select ${dataKey}`}>
      <Select.Option value={null}>All</Select.Option>
      {optionsForKey(dataKey).map((value) => (
        <Select.Option value={value} key={`Filter_${dataKey}_${value}`}>
          {value}
        </Select.Option>
      ))}
    </Select>
  )
}

export default Filter
