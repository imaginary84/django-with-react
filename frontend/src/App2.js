import React, { useEffect, useMemo, useRef, useState } from "react";

export default function App2({ initSizeX = 800, initSizeY = 800 }) {
  const [baseSizeX, setBaseSizeX] = useState(initSizeX);
  const [baseSizeY, setBaseSizeY] = useState(initSizeY);

  const fileInput = useRef();
  const viwer = useRef();
  const canvas = useRef();
  const ctx = useRef();
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [initRatio, setInitRatio] = useState(0);
  const image = useRef(null);

  const handleImageChange = (e) => {
    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      image.current = new Image();
      image.current.src = e.target.result;

      image.current.addEventListener("load", function () {
        setImageWidth(this.width);
        setImageHeight(this.height);
      });
    });

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    ctx.current = canvas.current.getContext("2d");
  }, []);

  useEffect(() => {
    if (imageWidth && imageHeight) {
      const ratioX = baseSizeX / imageWidth;
      const ratioY = baseSizeY / imageHeight;

      const ratio = Math.max(ratioX, ratioY);
      setInitRatio(ratio);
    }
  }, [imageWidth, imageHeight]);

  useEffect(() => {
    if (initRatio && image) {
      ctx.current.drawImage(
        image.current,
        imageWidth > imageHeight ? (imageWidth - imageHeight) / 2 : 0,
        imageHeight > imageWidth ? (imageHeight - imageWidth) / 2 : 0,
        imageWidth > imageHeight ? imageHeight : imageWidth,
        imageWidth > imageHeight ? imageHeight : imageWidth,
        0,
        0,
        800,
        800
      );
    }
  }, [initRatio, image]);

  const [drag, setDrag] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragMoveX, setDragMoveX] = useState(0);
  const [dragMoveY, setDragMoveY] = useState(0);

  const [dragTotalX, setDragTotalX] = useState(0);
  const [dragTotalY, setDragTotalY] = useState(0);

  const onMouseDown = (e) => {
    setDrag(true);
    setDragStartX(e.nativeEvent.layerX);
    setDragStartY(e.nativeEvent.layerY);
  };
  const onMouseMove = (e) => {
    if (drag) {
      setDragMoveX(dragStartX - e.nativeEvent.layerX);
      setDragMoveY(dragStartY - e.nativeEvent.layerY);

      ctx.current.clearRect(0, 0, 800, 800);

      ctx.current.drawImage(
        image.current,
        (imageWidth > imageHeight ? (imageWidth - imageHeight) / 2 : 0) +
          dragTotalX +
          dragMoveX,
        (imageHeight > imageWidth ? (imageHeight - imageWidth) / 2 : 0) +
          dragTotalY +
          dragMoveY,
        imageWidth > imageHeight ? imageHeight : imageWidth,
        imageWidth > imageHeight ? imageHeight : imageWidth,
        0,
        0,
        800,
        800
      );
    }
  };
  const onMouseUp = (e) => {
    setDrag(false);
    setDragTotalX((prev) => prev + dragMoveX);
    setDragTotalY((prev) => prev + dragMoveY);
    setDragMoveX(0);
    setDragMoveY(0);
  };

  const onMouseOut = (e) => {
    setDrag(false);
    setDragTotalX((prev) => prev + dragMoveX);
    setDragTotalY((prev) => prev + dragMoveY);
    setDragMoveX(0);
    setDragMoveY(0);
  };

  return (
    <>
      <h1>Image Upload</h1>
      <input
        type="file"
        id="image"
        onChange={handleImageChange}
        ref={fileInput}
        style={{ display: "" }}
      />
      <div
        style={{
          width: baseSizeX,
          height: baseSizeY,
          backgroundColor: "lightgray",
          //   overflow: "hidden",
        }}
      >
        <img id="viewer" alt="viewer" ref={viwer} style={{ display: "none" }} />
        <div>
          <canvas
            id="canvas"
            alt="canvas"
            ref={canvas}
            width={800}
            height={800}
            style={{ backgroundColor: "lightgray" }}
            // onClick={onCanvasClick}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseOut={onMouseOut}
          />
        </div>
      </div>
    </>
  );
}
