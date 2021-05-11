import { InputNumber, Select } from 'antd'
import React from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { datesAtom } from '../state'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 8px;
`

const PeriodInput = () => {
  const [dates, setDates] = useRecoilState(datesAtom)

  const onNumberChanged = (value) => {
    setDates({
      ...dates,
      beforePeriod: {
        ...dates.beforePeriod,
        value,
      },
    })
  }

  const onUnitChanged = (value) => {
    setDates({
      ...dates,
      beforePeriod: {
        ...dates.beforePeriod,
        unit: value,
      },
    })
  }

  return (
    <>
      Min before period
      <Container>
        <InputNumber
          value={dates.beforePeriod.value}
          onChange={onNumberChanged}
        ></InputNumber>
        <Select value={dates.beforePeriod.unit} onChange={onUnitChanged}>
          <Select.Option value="Days">Days</Select.Option>
          <Select.Option value="Weeks">Weeks</Select.Option>
          <Select.Option value="Months">Months</Select.Option>
        </Select>
      </Container>
    </>
  )
}

export default PeriodInput
