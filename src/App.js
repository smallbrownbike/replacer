import React from "react";
import Dropzone from "react-dropzone";
import uploadImage from "./upload.svg";
import editImage from "./edit.svg";
import addImage from "./add.svg";
import layersImage from "./layers.svg";
import roofImage from "./roof.svg";
import { Stage, Layer, Line, Image, Circle } from "react-konva";
import shingles1 from "./fills/shingles1.jpg";
import shingles2 from "./fills/shingles2.jpg";
import previews1 from "./previews/previews1.jpg";
import previews2 from "./previews/previews2.jpg";
import previews3 from "./previews/previews3.jpg";
import "./index.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      editMode: false,
      points: [],
      closed: false,
      shapes: [],
      circles: [],
      shapeHovered: false,
      shapeSelected: null,
      showLayers: false,
      fills: [shingles1, shingles2].map(fill => {
        const image = new window.Image();
        image.src = fill;
        return image;
      }),
      fillPattern: 0,
      showFills: false
    };
    this.stage = React.createRef();
  }
  handleClick = e => {
    if (this.state.editMode && !this.state.shapeHovered) {
      let points = this.state.points;
      const shapes = this.state.shapes;
      let circles = this.state.circles;
      points.push(e.clientX, e.clientY);
      const closed =
        Math.abs(points[points.length - 1] - points[1]) <= 10 &&
        Math.abs(points[points.length - 2] - points[0]) <= 10;
      if (points.length > 2 && closed) {
        points[points.length - 1] = points[1];
        points[points.length - 2] = points[0];
        shapes.push({ points, circles });
        points = [];
        circles = [];
      } else {
        circles.push({ x: e.clientX, y: e.clientY });
      }
      this.setState({
        shapeSelected: null,
        points,
        closed,
        shapes,
        circles
      });
    }
  };
  handleMouseMove = e => {
    let points = this.state.points;
    if (points.length) {
      if (points.length > 2) {
        points.splice(
          points.length - 2,
          2,
          this.stage.current.getPointerPosition().x,
          this.stage.current.getPointerPosition().y
        );
      } else {
        points.push(
          this.stage.current.getPointerPosition().x,
          this.stage.current.getPointerPosition().y
        );
      }
    }
    this.setState({
      points,
      x: -this.stage.current.getPointerPosition().x,
      y: -this.stage.current.getPointerPosition().y
    });
  };
  handleShapeHover = index => {
    if (!this.state.points.length) {
      const shapes = this.state.shapes;
      let shapeHovered = null;
      if (!shapes[index].hovered) {
        shapes[index].hovered = true;
        shapeHovered = true;
      } else {
        shapes[index].hovered = false;
        shapeHovered = false;
      }
      this.setState({ shapes, shapeHovered });
    }
  };
  handleShapeClick = index => {
    this.setState({
      shapeSelected: index
    });
  };
  handleKeyDown = e => {
    if (e.key === "Backspace") {
      if (this.state.shapeSelected !== null) {
        const shapes = this.state.shapes;
        shapes.splice(this.state.shapeSelected, 1);
        this.setState({ shapes, shapeSelected: null, shapeHovered: false });
      }
    }
    if (e.key === "Escape") {
      if (this.state.shapeSelected !== null) {
        this.setState({ shapeSelected: null });
      }
      if (this.state.points.length) {
        this.setState({ points: [], circles: [] });
      }
    }
  };

  handleDrop = file => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.setImage(reader.result);
    });
    reader.readAsDataURL(file[0]);
  };
  handleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };
  getSmallLines = points => {
    function getPercentage(num, original) {
      const decrease = (((original - 240) / original) * 100) / 100;

      const percentage = num * decrease;
      return num - percentage;
    }
    const newNums = points.map((num, index) => {
      const xAmount = getPercentage(num, window.innerWidth - 300);
      const yAmount = getPercentage(num, window.innerHeight);
      return index % 2 === 0 ? xAmount : yAmount;
    });
    return newNums;
  };
  handleFillClick = index => {
    this.setState({ fillPattern: index });
  };
  setImage = source => {
    const image = new window.Image();
    image.src = source;
    image.onload = () => {
      const ratio = Math.min((window.innerWidth - 300) / image.naturalWidth);
      this.setState({
        image: {
          width: image.naturalWidth * ratio,
          height: image.naturalHeight * ratio,
          source: image
        }
      });
    };
  };
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }
  render() {
    const {
      image,
      editMode,
      points,
      shapes,
      showLayers,
      showFills,
      fills,
      fillPattern
    } = this.state;
    const width = window.innerWidth - 300;
    return (
      <div>
        <div
          onMouseLeave={() =>
            this.setState({ hovered: false, x: null, y: null })
          }
          onMouseEnter={() =>
            this.setState({
              hovered: true
            })
          }
          onClick={this.handleClick}
        >
          <Stage
            ref={this.stage}
            style={{
              position: "absolute",
              cursor: this.state.shapeHovered
                ? "pointer"
                : !editMode
                ? "auto"
                : "crosshair",
              left: 0,
              top: 0
            }}
            width={width}
            height={window.innerHeight}
          >
            <Layer
              onMouseMove={editMode && this.handleMouseMove}
              x={this.state.x}
              y={this.state.y}
              scale={
                editMode && this.state.hovered ? { x: 2, y: 2 } : { x: 1, y: 1 }
              }
            >
              {image && (
                <Image
                  height={image.height}
                  width={image.width}
                  style={{ pointerEvents: "none" }}
                  image={image.source}
                />
              )}

              <Line
                closed={this.state.closed}
                points={this.state.points.map(num => num)}
                stroke="red"
                fill="black"
              />
              {this.state.shapes.map((shape, index) => {
                return (
                  <>
                    <Line
                      onClick={() => this.handleShapeClick(index)}
                      onMouseEnter={() => this.handleShapeHover(index)}
                      onMouseLeave={() => this.handleShapeHover(index)}
                      fillPatternImage={fills[fillPattern]}
                      fillPatternRepeat="repeat"
                      fillPatternScale={{ x: 0.05, y: 0.02 }}
                      fill={
                        index === this.state.shapeSelected
                          ? "green"
                          : shape.hovered
                          ? "#00800069"
                          : null
                      }
                      closed={true}
                      points={shape.points.map(num => num)}
                    />
                  </>
                );
              })}
              {this.state.circles.map(circle => {
                return (
                  <Circle x={circle.x} y={circle.y} radius={2} fill="black" />
                );
              })}
            </Layer>
          </Stage>
        </div>

        <div
          className="dropzone-container"
          style={{
            display: image ? "block" : "flex",
            width: !image ? window.innerWidth : 300,
            position: "absolute",
            right: 0,
            top: 0,
            boxSizing: "border-box",
            background: "#f3f3f3",
            minHeight: "100vh"
          }}
        >
          {!image ? (
            <>
              <Dropzone onDrop={this.handleDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "40px",
                      height: "100%",
                      boxSizing: "border-box",
                      width: "50%"
                    }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <p
                      style={{
                        margin: "auto",
                        padding: "20px",
                        border: " 2px dashed #b1adad",
                        borderRadius: "5px",
                        textAlign: "center"
                      }}
                    >
                      <img style={{ maxWidth: 80 }} src={uploadImage} />
                    </p>
                  </div>
                )}
              </Dropzone>
              <div className="preview-container">
                <div onClick={() => this.setImage(previews1)}>
                  <img src={previews1} />
                </div>
                <div onClick={() => this.setImage(previews2)}>
                  <img src={previews2} />
                </div>
                <div onClick={() => this.setImage(previews3)}>
                  <img src={previews3} />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* <div
                onClick={this.handleEditMode}
                style={{
                  padding: 20,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "300",
                  color: "#2d2d2d",
                  borderBottom: "1px solid #cecece"
                }}
              >
                <img
                  style={{ maxWidth: 40, marginRight: 20 }}
                  src={editImage}
                />
                <span>Edit</span>
              </div> */}
              <div
                onClick={this.handleEditMode}
                style={{
                  padding: 20,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "300",
                  color: "#2d2d2d",
                  borderBottom: "1px solid #cecece"
                }}
              >
                <img style={{ maxWidth: 40, marginRight: 20 }} src={addImage} />
                <span>Add Layer</span>
              </div>
              {editMode && (
                <div style={{ padding: 20, position: "relative" }}>
                  {!points ? (
                    <span style={{ fontWeight: 100 }}>
                      Start tracing your roof
                    </span>
                  ) : (
                    <Stage
                      style={{ background: "white" }}
                      width={240}
                      height={240}
                    >
                      <Layer>
                        <Line
                          stroke="red"
                          points={this.getSmallLines(points).map(num => num)}
                        />
                      </Layer>
                    </Stage>
                  )}
                </div>
              )}
              <div
                onClick={() => this.setState({ showLayers: !showLayers })}
                style={{
                  padding: 20,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "300",
                  color: "#2d2d2d",
                  borderBottom: "1px solid #cecece"
                }}
              >
                <img
                  style={{ maxWidth: 40, marginRight: 20 }}
                  src={layersImage}
                />
                <span>Layers</span>
                <div
                  style={{
                    position: "absolute",
                    right: "20px",
                    background: "black",
                    color: "white",
                    minWidth: "20px",
                    minHeight: "20px",
                    borderRadius: "50%",
                    padding: "3px"
                  }}
                >
                  {shapes.length}
                </div>
              </div>
              {showLayers && (
                <div style={{ padding: 20, position: "relative" }}>
                  {!shapes.length ? (
                    <span style={{ fontWeight: 100 }}>No layers yet</span>
                  ) : (
                    shapes.map((shape, index) => {
                      return (
                        <Stage
                          onClick={() => this.handleShapeClick(index)}
                          onMouseEnter={() => this.handleShapeHover(index)}
                          onMouseLeave={() => this.handleShapeHover(index)}
                          style={{ background: "white", marginBottom: 20 }}
                          width={240}
                          height={240}
                        >
                          <Layer>
                            <Line
                              closed={
                                shape.hovered ||
                                this.state.shapeSelected === index
                              }
                              stroke={
                                !shape.hovered &&
                                this.state.shapeSelected !== index &&
                                "red"
                              }
                              fill={
                                this.state.shapeSelected === index
                                  ? "green"
                                  : shape.hovered
                                  ? "#00800069"
                                  : "none"
                              }
                              points={this.getSmallLines(shape.points).map(
                                num => num
                              )}
                            />
                          </Layer>
                        </Stage>
                      );
                    })
                  )}
                </div>
              )}
              <div
                onClick={() => this.setState({ showFills: !showFills })}
                style={{
                  padding: 20,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "300",
                  color: "#2d2d2d",
                  borderBottom: "1px solid #cecece"
                }}
              >
                <img
                  style={{ maxWidth: 40, marginRight: 20 }}
                  src={roofImage}
                />
                <span>Roof Options</span>
              </div>
              {showFills && (
                <div style={{ padding: 20, position: "relative" }}>
                  {fills.map((fill, index) => {
                    return (
                      <div
                        onClick={() => this.handleFillClick(index)}
                        style={{ marginBottom: 20 }}
                        width={240}
                        height={240}
                      >
                        <img
                          style={{
                            border:
                              index === fillPattern
                                ? "5px solid green"
                                : "none",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            boxSizing: "border-box"
                          }}
                          src={fill.src}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default App;
