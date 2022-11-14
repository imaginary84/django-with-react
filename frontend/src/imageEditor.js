import React, { useEffect, useRef, useState } from "react";
import halloween from "assets/halloween.jpg";
import bridge from "assets/bridge.jpg";

export const ImageEditor = ({
  source,
  width = 850,
  height = 850,
  canvasRef,
  fileRef,
}) => {
  // const fileRef = useRef(null);
  // const canvasRef = useRef(null);
  const controllRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragMoveX, setDragMoveX] = useState(0);
  const [dragMoveY, setDragMoveY] = useState(0);

  const [dragTotalX, setDragTotalX] = useState(0);
  const [dragTotalY, setDragTotalY] = useState(0);

  const [initScale, setInitScale] = useState(1);
  const [scale, setScale] = useState(1);
  const imageRef = useRef(null);
  const ctxRef = useRef(null);

  const [editorWidth, setEditorWidth] = useState(width);
  const [editorHeight, setEditorHeight] = useState(height);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      ctxRef.current = canvas.getContext("2d");
      // canvas.style.backgroundColor = "lightgray";

      // imageRef.current = new Image();
      // imageRef.current.src = source;
      // imageRef.current.onload = () => {
      //   if (imageRef.current.width >= imageRef.current.height) {
      //     setScale((prev) => editorHeight / imageRef.current.height);
      //     setInitScale((prev) => editorHeight / imageRef.current.height);
      //   } else {
      //     setScale((prev) => editorWidth / imageRef.current.width);
      //     setInitScale((prev) => editorWidth / imageRef.current.width);
      //   }
      //   render();
      // };
    }
  }, []);

  useEffect(() => {
    if (imageRef.current) render();
  }, [
    dragMoveX,
    dragMoveY,
    dragTotalX,
    dragTotalY,
    scale,
    editorWidth,
    editorHeight,
  ]);

  function render() {
    ctxRef.current.clearRect(0, 0, editorWidth, editorHeight);

    // console.log("initScale ::", initScale, ", scale ::", scale);

    if (scale >= initScale) {
      if (
        Math.abs(dragTotalY) >
        (imageRef.current.height - editorHeight / scale) / 2
      ) {
        if (dragTotalY > 0) {
          setDragTotalY(
            () => (imageRef.current.height - editorHeight / scale) / 2
          );
        } else if (dragTotalY < 0) {
          setDragTotalY(
            () => ((imageRef.current.height - editorHeight / scale) / 2) * -1
          );
        }
      }

      if (
        Math.abs(dragTotalX) >
        (imageRef.current.width - editorWidth / scale) / 2
      ) {
        if (dragTotalX > 0) {
          setDragTotalX(
            () => (imageRef.current.width - editorWidth / scale) / 2
          );
        } else if (dragTotalX < 0) {
          setDragTotalX(
            () => ((imageRef.current.width - editorWidth / scale) / 2) * -1
          );
        }
      }
    }

    ctxRef.current.save();

    ctxRef.current.scale(scale, scale);

    ctxRef.current.drawImage(
      imageRef.current,
      0,
      0,
      imageRef.current.width,
      imageRef.current.height,
      0 - //시작점 0
        (imageRef.current.width - editorWidth / scale) / 2 - // scale을 적용하여 이미지를 가운데 놓기위한 계산.
        (dragMoveX + dragTotalX), //드래그 계산.
      0 - //시작점 0
        (imageRef.current.height - editorHeight / scale) / 2 - //scale을 적용하여 이미지를 가운데 놓기위한 계산.
        (dragMoveY + dragTotalY), //드래그 계산.
      imageRef.current.width,
      imageRef.current.height
    );

    ctxRef.current.restore();
  }

  const onCanvasMouseDown = (e) => {
    setDrag(true);
    setDragStartX(e.nativeEvent.layerX);
    setDragStartY(e.nativeEvent.layerY);
  };
  const onCanvasMouseMove = (e) => {
    if (drag) {
      setDragMoveX(dragStartX - e.nativeEvent.layerX);
      setDragMoveY(dragStartY - e.nativeEvent.layerY);
    }
  };
  const onCanvasMouseUp = () => {
    setDrag(false);
    setDragTotalX((prev) => prev + dragMoveX);
    setDragTotalY((prev) => prev + dragMoveY);
    setDragMoveX(0);
    setDragMoveY(0);
  };
  const onCanvasMouseOut = () => {
    setDrag(false);

    setDragTotalX((prev) => prev + dragMoveX);
    setDragTotalY((prev) => prev + dragMoveY);
    setDragMoveX(0);
    setDragMoveY(0);
  };

  const handleFileChange = (e) => {
    // console.log(e.target.files[0]);

    if (e.target.files.length > 0) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        // console.log("file read success.", e.target.result);

        imageRef.current = new Image();
        imageRef.current.src = e.target.result;
        imageRef.current.onload = () => {
          fileRef.current.style.display = "none";
          canvasRef.current.style.display = "block";
          // controllRef.current.style.display = "inline";
          controllRef.current.style.zIndex = 999;

          if (imageRef.current.width >= imageRef.current.height) {
            setScale((prev) => editorHeight / imageRef.current.height);
            setInitScale((prev) => editorHeight / imageRef.current.height);
          } else {
            setScale((prev) => editorWidth / imageRef.current.width);
            setInitScale((prev) => editorWidth / imageRef.current.width);
          }

          render();
        };
      };

      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const originRatioChange = (e) => {
    e.preventDefault();
    if (imageRef.current) {
      if (imageRef.current.width >= imageRef.current.height) {
        setScale(
          (prev) =>
            (850 * (imageRef.current.height / imageRef.current.width)) /
            imageRef.current.height
        );
        setInitScale(
          (prev) =>
            (850 * (imageRef.current.height / imageRef.current.width)) /
            imageRef.current.height
        );

        setEditorWidth((prev) => 850);
        setEditorHeight(
          (prev) => 850 * (imageRef.current.height / imageRef.current.width)
        );
      } else {
        setScale(
          (prev) =>
            (850 * (imageRef.current.width / imageRef.current.height)) /
            imageRef.current.width
        );
        setInitScale(
          (prev) =>
            (850 * (imageRef.current.width / imageRef.current.height)) /
            imageRef.current.width
        );

        setEditorWidth(
          (prev) => 850 * (imageRef.current.width / imageRef.current.height)
        );
        setEditorHeight((prev) => 850);
      }
    }
  };

  const oneOneRatioChange = (e) => {
    e.preventDefault();
    if (imageRef.current) {
      if (imageRef.current.width >= imageRef.current.height) {
        setScale((prev) => 850 / imageRef.current.height);
        setInitScale((prev) => 850 / imageRef.current.height);
      } else {
        setScale((prev) => 850 / imageRef.current.width);
        setInitScale((prev) => 850 / imageRef.current.width);
      }
      setEditorWidth((prev) => 850);
      setEditorHeight((prev) => 850);
    }
  };

  const fourFiveRatioChange = (e) => {
    e.preventDefault();
    if (imageRef.current) {
      if (imageRef.current.width >= imageRef.current.height) {
        setScale((prev) => 850 / imageRef.current.height);
        setInitScale((prev) => 850 / imageRef.current.height);
      } else {
        setScale((prev) => (850 * (4 / 5)) / imageRef.current.width);
        setInitScale((prev) => (850 * (4 / 5)) / imageRef.current.width);
      }
      setEditorWidth((prev) => 850 * (4 / 5));
      setEditorHeight((prev) => 850);
    }
  };

  const sixteenNineRatioChange = (e) => {
    e.preventDefault();
    if (imageRef.current) {
      if (imageRef.current.width >= imageRef.current.height) {
        setScale((prev) => 850 / imageRef.current.width);
        setInitScale((prev) => 850 / imageRef.current.width);
      } else {
        setScale((prev) => 850 / imageRef.current.width);
        setInitScale((prev) => 850 / imageRef.current.width);
      }
      setEditorWidth((prev) => 850);
      setEditorHeight((prev) => 850 * (9 / 16));
    }
  };

  return (
    <>
      <div
        style={{
          width: 850,
          height: 850,
          backgroundColor: "lightgray",
          position: "relative",
          // textAlign: "center",
        }}
      >
        <div
          ref={fileRef}
          style={{
            width: editorWidth,
            height: editorHeight,
            backgroundColor: "lightgray",
            textAlign: "center",
            position: "absolute",
          }}
        >
          <input
            type="file"
            style={{ margin: "0 auto", marginTop: editorHeight * 0.45 + "px" }}
            onChange={handleFileChange}
          />
        </div>
        <canvas
          ref={canvasRef}
          width={editorWidth}
          height={editorHeight}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          onMouseOut={onCanvasMouseOut}
          style={{
            display: "none",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
          }}
        />
        <div
          ref={controllRef}
          style={{ position: "absolute", zIndex: -1, bottom: 0 }}
        >
          <button onClick={originRatioChange}>원본</button>
          <button onClick={oneOneRatioChange}>1:1</button>
          <button onClick={fourFiveRatioChange}>4:5</button>
          <button onClick={sixteenNineRatioChange}>16:9</button>
          <input
            type="range"
            min={initScale}
            max={initScale * 2}
            step={0.001}
            value={scale}
            onChange={(e) => {
              setScale(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
};

const App3 = () => {
  const canvasRef = useRef(null);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <ImageEditor canvasRef={canvasRef} />
      </div>
    </div>
  );
};

export default App3;
