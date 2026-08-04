import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function UploadDocument({ onUpload, disabled, isUploading }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || disabled) return;
    const success = await onUpload(selectedFile);
    if (success) {
      setSelectedFile(null);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <h3 className="text-base font-semibold text-slate-100 mb-1 flex items-center gap-2">
        <FileUp className="w-5 h-5 text-blue-400" /> Upload Document
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Upload a single PDF to extract vectors & perform RAG search.
      </p>

      {disabled ? (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>An active document exists. Delete it to upload another PDF.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/40'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleChange}
            />

            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/20">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200">
                {selectedFile ? selectedFile.name : 'Drag & Drop PDF here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'or click to browse from device'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? <LoadingSpinner size="sm" label="Processing PDF..." /> : 'Upload & Process'}
          </button>
        </form>
      )}
    </div>
  );
}