import React from "react";
import Editor from "./Editor";
import Dropzone from "react-dropzone";
import uploadImage from "./upload.svg";
import editImage from "./edit.svg";
import addImage from "./add.svg";
import layersImage from "./layers.svg";
import { Stage, Layer, Line } from "react-konva";
import "./index.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      editMode: false,
      layers: null
    };
  }
  handleDrop = file => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.src = reader.result;
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
    });
    reader.readAsDataURL(file[0]);
  };
  handleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };
  addPoints = layers => {
    function getPercentage(num, original) {
      const decrease = (((original - 240) / original) * 100) / 100;

      const percentage = num * decrease;
      return num - percentage;
    }
    const newNums = layers.map((num, index) => {
      const xAmount = getPercentage(num, window.innerWidth - 300);
      const yAmount = getPercentage(num, window.innerHeight);
      return index % 2 === 0 ? xAmount : yAmount;
    });
    console.log(layers, newNums);
    this.setState({ layers: newNums });
  };
  componentDidMount() {}
  render() {
    const { image, editMode, layers } = this.state;
    return (
      <div>
        <Editor
          addPoints={this.addPoints}
          image={
            image && {
              width: image.width,
              height: image.height,
              source: image.source
            }
          }
          editMode={editMode}
          width={window.innerWidth - 300}
        />{" "}
        <div
          className="dropzone-container"
          style={{
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
            <Dropzone onDrop={this.handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px",
                    height: "100%",
                    position: "absolute",
                    boxSizing: "border-box",
                    width: "100%"
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
                <span>Add</span>
              </div>
              {editMode && (
                <div style={{ padding: 20, position: "relative" }}>
                  {!layers ? (
                    "Start tracing your roof"
                  ) : (
                    <Stage width={240} height={240}>
                      <Layer>
                        <Line stroke="red" points={layers.map(num => num)} />
                      </Layer>
                    </Stage>
                  )}
                </div>
              )}
              <div
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
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default App;
