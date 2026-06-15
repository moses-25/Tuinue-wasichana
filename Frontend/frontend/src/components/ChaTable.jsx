import React from 'react';

export default function CharitiesTable({ data, onEdit, onDelete }) {
  return (
    <table className="charity-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Goal</th>
          <th>Location</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((charity) => (
          <tr key={charity.id}>
            <td>{charity.name}</td>
            <td>{charity.category}</td>
            <td>${charity.goal}</td>
            <td>{charity.location}</td>
            <td>{charity.status}</td>
            <td>
              <button onClick={() => onEdit(charity.id, { status: charity.status === 'Active' ? 'Paused' : 'Active' })}>
                {charity.status === 'Active' ? 'Pause' : 'Activate'}
              </button>
              <button onClick={() => onDelete(charity.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
