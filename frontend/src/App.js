import React, { useEffect, useState } from "react";

export default function App() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // console.log(value);
  }, []);

  return (
    <div
      onClick={() => {
        setValue((prev) => 1);
      }}
    >
      Hello World.{value}
    </div>
  );
}
