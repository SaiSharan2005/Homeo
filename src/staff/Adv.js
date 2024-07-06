import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [forwardLink, setForwardLink] = useState('');
  const [adminId, setAdminId] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleForwardLinkChange = (e) => {
    setForwardLink(e.target.value);
  };

  const handleAdminIdChange = (e) => {
    setAdminId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('forwardLink', forwardLink);
    formData.append('adminId', adminId);

    try {
      const response = await fetch('http://localhost:8080/advertisement/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image.');
      }

      const data = await response.json();
      console.log(data); // Log the response from the server

      // Optionally, reset the form fields after successful upload
      setFile(null);
      setForwardLink('');
      setAdminId('');
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Upload Advertisement</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Choose Image:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <label>Forward Link:</label>
          <input type="text" value={forwardLink} onChange={handleForwardLinkChange} />
        </div>
        <div>
          <label>Admin ID:</label>
          <input type="text" value={adminId} onChange={handleAdminIdChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;
