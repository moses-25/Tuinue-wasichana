


import React, { useState } from 'react';

export default function NewCharityModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    goal: '',
    location: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitCharity = () => {
    if (form.name && form.category && form.goal && form.location) {
      const newCharity = { ...form, id: Date.now(), status: 'Active' };
      onSubmit(newCharity);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Post New Charity</h2>
        <input name="name" placeholder="Charity Name" onChange={handleChange} />
        <select name="category" onChange={handleChange}>
          <option value="">Select Category</option>
          <option>Health</option>
          <option>Education</option>
          <option>Environment</option>
        </select>
        <input name="goal" placeholder="Amount Goal" type="number" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <button onClick={submitCharity}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
