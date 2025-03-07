'use client';
import React, { useState } from 'react';

// Define a unified type for files and folders
type File = {
  id: number;
  name: string;
  type: string;
  parentId: number | null;
  fileUrl?: string;
  fileType?: string;
};

const initialFolders: File[] = [
  { id: 1, name: 'Documents', type: 'folder', parentId: null },
  { id: 2, name: 'Photos', type: 'folder', parentId: null },
  { id: 3, name: 'Videos', type: 'folder', parentId: null },
  { id: 4, name: 'Excel Files', type: 'folder', parentId: null },
  { id: 5, name: 'PDFs', type: 'folder', parentId: null },
  { id: 6, name: 'Word Docs', type: 'folder', parentId: null },
  { id: 7, name: 'Dox', type: 'folder', parentId: null },
  { id: 8, name: 'Other', type: 'folder', parentId: null },
];

const GoogleDriveClone = () => {
  const [folders, setFolders] = useState<File[]>(initialFolders); // Initialize state with initial folders
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null); // Initialize currentFolderId state
  const [searchQuery, setSearchQuery] = useState<string>(''); // Initialize searchQuery state

  const handleFolderClick = (folderId: number) => {
    setCurrentFolderId(folderId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      // Check if there's a selected folder
      if (currentFolderId === null) {
        console.log('Please select a folder first');
        alert('Please select a folder to upload the file to.');
        return;
      }

      console.log('File selected:', file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("type", "file");
      formData.append("parentId", currentFolderId.toString()); // Ensure parentId is a string

      fetch("http://localhost:8000/api/v1/file-folder", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('File upload failed');
          }
          return res.json();
        })
        .then((data) => {
          console.log('Upload Success:', data);

          // After successful upload, you can update the folders or file list state
          // For example, add the new file to the current folder state
          setFolders((prevFolders) => [
            ...prevFolders,
            {
              ...data, // Assuming the API returns the newly uploaded file data
              type: 'file',
              parentId: currentFolderId,
            },
          ]);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
        });
    }
  };

  const filteredFoldersAndFiles = folders.filter(
    (item) =>
      item.parentId === currentFolderId &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileOpen = (file: File) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, '_blank');
    }
  };

  const handleFileDownload = (file: File) => {
    if (file.fileUrl) {
      const link = document.createElement('a');
      link.href = file.fileUrl;
      link.download = file.name;
      link.click();
    }
  };

  return (
    <div className="google-drive-clone flex h-screen">
      {/* Sidebar */}
      <div className="sidebar w-64 p-4 bg-gray-800 text-white overflow-x-auto" style={{ maxHeight: '100vh' }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-600 text-white p-2 rounded-md w-full mb-4"
        />

        {/* Back Button */}
        <button
          onClick={() => setCurrentFolderId(null)}
          className="text-white py-2 px-4 rounded-md mb-4 hover:bg-gray-700 w-full text-left"
        >
          &#8592; My Drive
        </button>

        {/* Folders Heading, only show at root level */}
        {currentFolderId === null && <h3 className="text-lg font-semibold mb-2">Folders</h3>}

        {/* Folders */}
        {filteredFoldersAndFiles
          .filter((item) => item.type === 'folder')
          .map((folder: File) => (
            <div key={folder.id} className="relative">
              <button
                onClick={() => handleFolderClick(folder.id)}
                className="text-white py-2 px-4 rounded-md mb-2 w-full text-left hover:bg-gray-700"
              >
                📁 {folder.name}
              </button>
            </div>
          ))}

        {/* Files Section */}
        <h3 className="text-lg font-semibold mb-2">Files</h3>
        {filteredFoldersAndFiles
          .filter((item) => item.type === 'file')
          .map((file: File) => (
            <div key={file.id} className="relative">
              <div
                className="text-white mb-2 cursor-pointer hover:bg-gray-600"
                onClick={() => handleFileOpen(file)} // Open file when clicked
              >
                {file.fileType === 'image' ? (
                  <img src={file.fileUrl} alt={file.name} className="w-32 h-32 object-cover mb-2" />
                ) : file.fileType === 'video' ? (
                  <video
                    src={file.fileUrl}
                    className="w-32 h-32 object-cover mb-2"
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>📄 {file.name}</p>
                )}
              </div>
              <button
                onClick={() => handleFileDownload(file)} // Trigger download
                className="text-blue-500"
              >
                Download
              </button>
            </div>
          ))}

        {/* Hidden file input */}
        <input
          type="file"
          id="fileInput"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Custom Upload Button */}
        <button
          onClick={() => document.getElementById('fileInput')?.click()}
          className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mt-4 hover:bg-blue-700"
        >
          Upload File
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content flex-1 p-6 bg-gray-900 overflow-x-auto">
        <h2 className="text-white text-2xl font-semibold mb-4">
          {currentFolderId === null
            ? 'My Drive'
            : folders.find((folder) => folder.id === currentFolderId)?.name}
        </h2>

        <div className="files flex flex-wrap gap-4">
          {/* Render Folders and Files in Main Content */}
          {filteredFoldersAndFiles.map((item: File) =>
            item.type === 'folder' ? (
              <div
                key={item.id}
                onClick={() => handleFolderClick(item.id)}
                className="folder w-36 p-4 mb-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
              >
                <h3 className="text-white">{item.name}</h3>
              </div>
            ) : (
              <div
                key={item.id}
                onClick={() => {}}
                className="file w-36 p-4 mb-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
              >
                <h3 className="text-white">{item.name}</h3>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveClone;
