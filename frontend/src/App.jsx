import React, { useState } from 'react';
import './App.css';
import MainPage from './components/MainPage';
import DownloadFile from './components/DownloadFile';
import UpdateFile from './components/UpdateFile';
import DeleteUser from './components/DeleteUser';
import DeleteFile from './components/DeleteFile';
import GetFilesList from './components/GetFilesList';
import UploadFile from './components/UploadFile';
import LoginUser from './components/LoginUser';
import GetUsersList from './components/GetUsersList';
import RegistrationForm from './components/RegistrationForm';
import TestList from './components/TestList';
import FileItem from './components/FileItem';
import Logout from './components/Logout';
import UserList from './components/UserList';
import LogoutToUser from './components/LogoutToUser';
import GetFilesListAdmin from './components/GetFilesListAdmin';
import DeleteFileAdmin from './components/DeleteFileAdmin';
import UpdateFileAdmin from './components/UpdateFileAdmin';
import { Routes, Route } from 'react-router-dom';


function App() {

  return(
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/reg" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/logout-user" element={<LogoutToUser />} />
      <Route path="/files" element={<GetFilesList />} />
      <Route path="/files-admin" element={<GetFilesListAdmin />} />
      <Route path="/delete-user" element={<DeleteUser />} />
      <Route path="/upload" element={<UploadFile />} />
      <Route path="/test" element={<TestList />} />
      <Route path="/users" element={<GetUsersList />} />
      <Route path="/user" element={<UserList />} />
      <Route path="/user-file" element={<FileItem />} />
      <Route path="/update-file" element={<UpdateFile />} />
      <Route path="/update-file-admin" element={<UpdateFileAdmin />} />
      <Route path="/delete-file" element={<DeleteFile />} />
      <Route path="/delete-file-admin" element={<DeleteFileAdmin />} />
      <Route path="/download" element={<DownloadFile />} />
    </Routes>
  )
}

export default App;