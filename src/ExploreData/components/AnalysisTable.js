import React from 'react'
import { Table } from 'antd'
import { useRecoilValue } from 'recoil'
import { analysisAtom } from '../state'

const columns = [
  {
    title: 'Gender',
    dataIndex: 'gender',
  },
  {
    title: 'Age range',
    dataIndex: 'ageRange',
  },
  {
    title: 'p',
    dataIndex: 'p',
    render: (_, v) => <span>{v.p.toFixed(4)}</span>,
  },
  {
    title: 'testValue',
    dataIndex: 'testValue',
    render: (_, v) => <span>{v.testValue.toFixed(4)}</span>,
  },
  {
    title: 'Valid',
    dataIndex: 'valid',
    render: (_, v) => <span>{v.valid ? 'True' : 'False'}</span>,
  },
  {
    title: 'Freedom',
    dataIndex: 'freedom',
  },
  {
    title: 'Before',
    dataIndex: 'before',
    render: (_, v) => <span>{parseInt(v.before)}</span>,
  },
  {
    title: 'After',
    dataIndex: 'after',
    render: (_, v) => <span>{parseInt(v.after)}</span>,
  },
  {
    title: 'Diff',
    dataIndex: 'diff',
    render: (_, v) => <span>{(v.before - v.after).toFixed(2)}</span>,
  },
]

const AnalysisTable = () => {
  const analysis = useRecoilValue(analysisAtom)

  return (
    <Table
      pagination={{ pageSize: analysis.length }}
      size="small"
      dataSource={analysis.map((row, i) => ({ ...row, key: `Row_${i}` }))}
      columns={columns}
      onRow={(v) => ({ style: { fontWeight: v.valid ? 400 : 700 } })}
    ></Table>
  )
}

export default AnalysisTable
