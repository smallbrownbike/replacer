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
    if (this.props.editMode && !this.state.shapeHovered) {
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
      this.props.addPoints(points);
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
    const shingle = new window.Image();
    shingle.src =
      "https://images.homedepot-static.com/productImages/855df4ec-e09a-4391-b7b4-4ba82362808b/svn/gray-owens-corning-roof-shingles-hk20-64_1000.jpg";

    this.setState({ shingle });
  }
  render() {
    return (
      
    );
  }
}

export default Editor;
