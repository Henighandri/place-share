import React from 'react'
import Card from '../../../shared/components/UIElement/Card'
import UserItem from '../userItem/UserItem'
import './UserList.css'

const UsersList = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No Users found.</h2>
        </Card>
      </div>
    )
  }
  return (
    <ul className='users-list'>
      {items.map(user => {
        return <UserItem key={user.id} user={user} />
      })}
    </ul>
  )
}

export default UsersList
