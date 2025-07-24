import React from 'react';

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div style={{ background: "#ccc", height: 10, width: "100%", marginTop: 10 }}>
    <div style={{ background: "#4caf50", width: `${progress}%`, height: "100%" }} />
  </div>
);

export default ProgressBar;
