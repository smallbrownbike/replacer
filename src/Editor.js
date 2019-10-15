import React from "react";
import { Stage, Layer, Line, Image, Circle } from "react-konva";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: [],
      closed: false,
      shapes: [],
      circles: [],
      shapeHovered: false,
      shapeSelected: null
    };
    this.stage = React.createRef();
  }
  handleClick = e => {
    if (!this.state.shapeHovered) {
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
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    const img = new window.Image();
    const shingle = new window.Image();
    shingle.src =
      "https://images.homedepot-static.com/productImages/855df4ec-e09a-4391-b7b4-4ba82362808b/svn/gray-owens-corning-roof-shingles-hk20-64_1000.jpg";

    img.src = "https://firstqualityroof.com/img/testimonials-image.jpg";
    img.onload = e => {
      const ratio = Math.min(window.innerWidth / 2 / img.naturalWidth);
      this.setState({
        imageWidth: img.naturalWidth * ratio,
        imageHeight: img.naturalHeight * ratio
      });
    };
    this.setState({ image: img, shingle });
  }
  render() {
    return (
      <div
        onMouseLeave={() => this.setState({ hovered: false, x: null, y: null })}
        onMouseEnter={() =>
          this.setState({
            hovered: true
          })
        }
        onClick={this.handleClick}
        className="App"
      >
        <Stage
          ref={this.stage}
          style={{
            position: "absolute",
            left: 0,
            cursor: this.state.shapeHovered ? "pointer" : "crosshair"
          }}
          width={window.innerWidth / 2}
          height={window.innerHeight}
        >
          <Layer
            onMouseMove={this.handleMouseMove}
            x={this.state.x}
            y={this.state.y}
            scale={this.state.hovered ? { x: 2, y: 2 } : { x: 1, y: 1 }}
          >
            <Image
              height={this.state.imageHeight}
              width={this.state.imageWidth}
              style={{ pointerEvents: "none" }}
              image={this.state.image}
            />
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
                    fillPatternImage={this.state.shingle}
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
                <Circle
                  draggable
                  x={circle.x}
                  y={circle.y}
                  radius={2}
                  fill="black"
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default Editor;
