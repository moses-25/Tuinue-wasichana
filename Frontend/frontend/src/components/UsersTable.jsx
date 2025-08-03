


import { FiTrash2, FiUser } from 'react-icons/fi';

const UsersTable = ({ users, onDelete }) => {
  console.log('UsersTable received users:', users);
  
  return (
    <div className="users-table">
      <h2>User Management</h2>
      
      {users && users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <FiUser className="user-icon" /> {user.name}
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.joined}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => onDelete(user.id)}
                    title="Delete this user"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-users">
          <p>No users found.</p>
          <p>Users will appear here when they register on the platform.</p>
        </div>
      )}
    </div>
  );
};

export default UsersTable;