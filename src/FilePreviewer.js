import * as R from 'ramda';
import React, { useState, useEffect } from 'react';

import styles from './styles';
import setZoomIn from './utils/setZoomIn';
import setZoomOut from './utils/setZoomOut';
import hasManyFiles from './utils/hasManyFiles';
import getTotalFiles from './utils/getTotalFiles';
import setNewRotation from './utils/setNewRotation';

import PreviewBar from './PreviewBar';
import ViewportControl from './ViewportControl';
import ViewportContent from './ViewportContent';
import FilesController from './FilesController';

const FilePreviewer = ({ files, onFilesChange }) => {
  // States for multiple files and their manipulation.
  const [filesProxy, setFilesChangeProxy] = useState(files);
  const [currentFileIndex, setCurrentFileIndex] = useState(1);

  useEffect(() => {
    if (R.is(Function, onFilesChange)) {
      onFilesChange(filesProxy);
    }

    return;
  }, [filesProxy]);

  // Get the total pages amount.
  const totalFiles = getTotalFiles(files);

  // Get a function to range the `currentPage` possible values.
  const currentFileClamp = R.clamp(1, totalFiles);

  // States for multiple-pages documents.
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // HANDLERS.

  const handlePreviousFile = () => {
    setCurrentFileIndex(prevState => currentFileClamp(prevState - 1));
  };

  const handleNextFile = () => {
    setCurrentFileIndex(prevState => currentFileClamp(prevState + 1));
  };

  const handlePageUp = () => {
    setCurrentPage(prevState => R.clamp(1, totalPages, prevState - 1));
  };

  const handlePageDown = () => {
    setCurrentPage(prevState => R.clamp(1, totalPages, prevState + 1));
  };

  const handleTotalPages = totalPages => {
    setTotalPages(totalPages);
  };

  const handleCurrentPageChange = currentPage => {
    setCurrentPage(currentPage);
  };

  const handleRotate = () => {
    const updatedFiles = R.adjust(
      currentFileIndex - 1,
      setNewRotation,
      filesProxy,
    );

    setFilesChangeProxy(updatedFiles);
  };

  const handleZoomIn = () => {
    const updatedFiles = R.adjust(currentFileIndex - 1, setZoomIn, filesProxy);
    setFilesChangeProxy(updatedFiles);
  };

  const handleZoomOut = () => {
    const updatedFiles = R.adjust(currentFileIndex - 1, setZoomOut, filesProxy);
    setFilesChangeProxy(updatedFiles);
  };

  // RENDER.

  return (
    <div style={styles.wrapperStyles}>
      <PreviewBar
        onPageUp={handlePageUp}
        totalPages={totalPages}
        onRotate={handleRotate}
        currentPage={currentPage}
        onPageDown={handlePageDown}
      />

      <ViewportContent
        totalPages={totalPages}
        currentPage={currentPage}
        onTotalPages={handleTotalPages}
        onCurrentPageChange={handleCurrentPageChange}
        file={R.nth(currentFileIndex - 1, filesProxy)}
      />

      <ViewportControl
        files={filesProxy}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentPage={currentFileIndex}
      />

      {hasManyFiles(filesProxy) && (
        <FilesController
          files={filesProxy}
          onNextFile={handleNextFile}
          currentPage={currentFileIndex}
          onPreviousFile={handlePreviousFile}
        />
      )}
    </div>
  );
};

export default FilePreviewer;