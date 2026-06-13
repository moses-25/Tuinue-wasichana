


import { FiTrash2, FiUser } from 'react-icons/fi';

const UsersTable = ({ users, onDelete }) => {
  return (
    <div className="users-table">
      <h2>User Management</h2>
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
              <td>{new Date(user.joined).toLocaleDateString()}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(user.id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;