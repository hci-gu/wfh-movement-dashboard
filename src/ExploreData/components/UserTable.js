import React from 'react'
import { Table } from 'antd'
import { useRecoilValue } from 'recoil'
import { usersSelector } from '../state'
import User from './User'
import moment from 'moment'

const columns = [
  {
    title: 'Age range',
    dataIndex: 'ageRange',
    key: 'ageRange',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    sorter: (a, b) => new Date(a.created) - new Date(b.created),
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{moment(u.created).format('YYYY-MM-DD')}</span>,
  },
  {
    title: 'Compare date',
    dataIndex: 'compareDate',
    key: 'compareDate',
    sorter: (a, b) => new Date(a.compareDate) - new Date(b.compareDate),
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{moment(u.compareDate).format('YYYY-MM-DD')}</span>,
  },
  {
    title: 'Initial data date',
    dataIndex: 'initialDataDate',
    key: 'initialDataDate',
    sorter: (a, b) => new Date(a.initialDataDate) - new Date(b.initialDataDate),
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => (
      <span>{moment(u.initialDataDate).format('YYYY-MM-DD')}</span>
    ),
  },
  {
    title: 'Days',
    dataIndex: 'days',
    key: 'days',
    sorter: (a, b) => a.days.length - b.days.length,
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{u.days.length}</span>,
  },
]

const UserTable = () => {
  const users = useRecoilValue(usersSelector)

  return (
    <Table
      style={{ width: '100%' }}
      dataSource={users.map((u, i) => ({ ...u, key: `Table_user_${i}` }))}
      columns={columns}
      expandable={{
        expandedRowRender: (u) => <User user={u} />,
        // rowExpandable: (record) => record.name !== 'Not Expandable',
      }}
    ></Table>
  )
}

export default UserTable
