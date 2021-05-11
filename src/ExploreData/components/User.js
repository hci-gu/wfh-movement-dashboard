import styled from 'styled-components'
import React from 'react'
import { Line } from '@ant-design/charts'

const Container = styled.div``

const User = ({ user }) => {
  var config = {
    width: 1200,
    height: 400,
    data: user.days,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
  }

  return (
    <Container>
      <Line {...config} />
    </Container>
  )
}

export default User
