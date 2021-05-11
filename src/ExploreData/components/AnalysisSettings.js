import { Checkbox, InputNumber } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import { analysisSettingsAtom } from '../state'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AnalysisSettings = () => {
  /*
    includeWeekends: true,
    monthsBefore: 3,
    monthsAfter: 3,
    maxMissingDaysBefore: 0.05,
    maxMissingDaysAfter: 0.05,
    workers: 16,
  */
  const [settings, setSettings] = useRecoilState(analysisSettingsAtom)

  const onChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  return (
    <Container>
      <h2>Analysis settings</h2>
      <Row>
        <span>Months before</span>
        <InputNumber
          value={settings.monthsBefore}
          onChange={(value) => onChange('monthsBefore', value)}
        />
      </Row>
      <Row>
        <span>Months after</span>
        <InputNumber
          value={settings.monthsAfter}
          onChange={(value) => onChange('monthsAfter', value)}
        />
      </Row>
      <Row>
        <span>Max missing days before</span>
        <InputNumber
          value={settings.maxMissingDaysBefore}
          onChange={(value) => onChange('maxMissingDaysBefore', value)}
        />
      </Row>
      <Row>
        <span>Max missing days before</span>
        <InputNumber
          value={settings.maxMissingDaysAfter}
          onChange={(value) => onChange('maxMissingDaysAfter', value)}
        />
      </Row>
      <Row>
        <span>Webworkers</span>
        <InputNumber
          value={settings.workers}
          onChange={(value) => onChange('workers', value)}
        />
      </Row>
      <Row>
        <span>Include weekends</span>
        <Checkbox
          value={settings.includeWeekends}
          onChange={(value) => onChange('includeWeekends', value)}
        />
      </Row>
    </Container>
  )
}

export default AnalysisSettings
