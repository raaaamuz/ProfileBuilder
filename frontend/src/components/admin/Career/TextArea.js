import React, { useState } from "react";

const TestTextarea = () => {
  const [text, setText] = useState("");
  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      style={{ width: "300px", height: "100px" }}
    />
  );
};

export default TestTextarea;
