

import React, { useRef, useState, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import wrcbg2 from "./WIRC.png";
import html2canvas from "html2canvas";
import "./styles.css";
import "react-image-crop/dist/ReactCrop.css";

const ImageCrp = () => {
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    const [completedCrop, setCompletedCrop] = useState();
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [imgSrc, setImgSrc] = useState("");
    const [aspect, setAspect] = useState(1);
    const [canvasDataUrl, setCanvasDataUrl] = useState(null);
    const combinedCanvasRef = useRef(null);
    const [fullName, setFullName] = useState("");
    const [designation, setdesignation] = useState("");

    function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: "%",
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight
            ),
            mediaWidth,
            mediaHeight
        );
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                const canvas = previewCanvasRef.current;
                const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
                const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

                canvas.width = Math.floor(completedCrop.width * scaleX);
                canvas.height = Math.floor(completedCrop.height * scaleY);

                canvasPreview(imgRef.current, canvas, completedCrop, scale, rotate);
                setCanvasDataUrl(canvas.toDataURL());
            }
        },
        100,
        [completedCrop, scale, rotate]
    );

    useEffect(() => {
        if (canvasDataUrl && combinedCanvasRef.current) {
            const combinedCanvas = combinedCanvasRef.current;
            const context = combinedCanvas.getContext("2d");

            const background = new Image();
            background.src = wrcbg2;
            background.onload = () => {
                combinedCanvas.width = background.width;
                combinedCanvas.height = background.height;
                context.drawImage(background, 0, 0);

                const uploadedImage = new Image();
                uploadedImage.src = canvasDataUrl;
                uploadedImage.onload = () => {
                    const centerX = 3240 + 1500; // Adjust 1480 and 425 as needed
                    const centerY = 435 + 950; // Adjust 550 and 425 as needed
                    const radius = 1050; // Adjust as needed

                    context.save();
                    context.beginPath();
                    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                    context.clip();
                    context.drawImage(uploadedImage, 3500, 345, 2300, 2300);
                    context.restore();

                    const textX = 100 + 100;
                    const textY = 100 + 100; // Adjust the distance from the bottom of the image
                    context.fillStyle = "white";
                    context.textAlign = "center";
                    context.fillText(fullName, textX, textY);
                    context.fillText(designation, textX, textY);
                };
            };
        }
    }, [canvasDataUrl, fullName, designation]);

    function onImageLoad(e) {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    }

    const Gen = () => {
        const na = document.getElementById("name");
        const des = document.getElementById("designation");
        const im = document.getElementById("image");
        im.style.display = "block";
        na.style.display = "none";
    };

    const download = () => {
        const scaleFactor = 2; // Increase this for higher resolution
        html2canvas(document.getElementById("img"), { scale: scaleFactor }).then(
            function (canvas) {
                const image = canvas.toDataURL("image/png", 1.0);
                const link = document.createElement("a");
                link.download = "WIRC Attendee";
                link.href = image;
                link.click();
            }
        );
    };

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Makes crop preview update between images.
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                setImgSrc(reader.result?.toString() || "")
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    return (
        <div>
            <div className="container-fluid">
                {/* <nav className="navbar navbar-default row">
          <div className="nav-header col-12">
            <a className="navbar-brand" href="#">
              <img
                alt="brand"
                id="brand2"
                className="img img-responsive"
                src={wrclogo}
                style={{ width: "700px", height: "150px", marginTop: "10px" }}
              />
            </a>
          </div>
        </nav> */}
            </div>
            <div>
                <div id="name">
                    <div
                        className="col-12"
                        style={{
                            display: "flex",
                            border: " 2px solid black",
                            width: "80%",
                            justifyContent: "center",
                            marginLeft: "10%",
                            marginTop: "10%",
                            backgroundColor: "white",
                        }}
                    >
                        <div>
                            <div>
                                <h3 style={{ color: "dark blue" }}>
                                    Generate I Am 38 Regional Conference Attendee
                                </h3>
                            </div>
                            <div>
                                <form action="/ImageCropper">
                                    <label htmlFor="fname" style={{ marginLeft: "-10px" }}>
                                        <b>Enter Your Full name</b>(30 Char-Line 1):
                                    </label>
                                    <input
                                        type="text"
                                        id="fname"
                                        name="fname"
                                        onChange={(e) => setFullName(e.target.value)}
                                        style={{ margin: "8px", width: "260px" }}
                                    />
                                    <br />
                                    <label htmlFor="des" style={{ marginLeft: "-10px" }}>
                                        <b>Designation</b>(30 Char-Line 2):                  </label>
                                    <input
                                        type="text"
                                        id="des"
                                        name="designation"
                                        onChange={(e) => setdesignation(e.target.value)}
                                        style={{ margin: "8px", width: "260px" }}
                                    />
                                    <br />
                                    <label htmlFor="" style={{ marginLeft: "-10px" }}>
                                        Upload Your Photo:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onSelectFile}
                                        style={{ margin: "8px", width: "260px" }}
                                    />
                                </form>
                            </div>
                            <div>
                                {!!imgSrc && (
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={aspect}
                                        circularCrop
                                    >
                                        <img
                                            ref={imgRef}
                                            alt="Crop me"
                                            src={imgSrc}
                                            style={{
                                                width: "500px",
                                                transform: `scale(${scale}) rotate(${rotate}deg)`,
                                            }}
                                            onLoad={onImageLoad}
                                        />
                                    </ReactCrop>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={Gen}
                            style={{ margin: "15px" }}
                        >
                            Generate Image
                        </button>
                    </div>
                </div>

                <div
                    id="image"
                    className=" container-fluid  main"
                    style={{
                        display: "none",
                    }}
                >
                    <div className="row">
                        <div
                            className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12"
                            style={{ marginTop: "2%" }}
                        >
                            <div
                                className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12"
                                id="img"
                                style={{
                                    backgroundImage: `url(${wrcbg2})`,
                                    height: "650px",
                                    width: "650px",
                                    backgroundSize: "cover",
                                    marginTop: "15%",
                                    margin: "auto",
                                    backgroundPosition: "center",
                                    objectFit: "cover",
                                }}
                            >
                                {!!completedCrop && (
                                    <>
                                        <div style={{ display: "flex" }}>
                                            <canvas
                                                id="canvas"
                                                ref={previewCanvasRef}
                                                style={{
                                                    borderRadius: "50%",
                                                    marginLeft: "346px",
                                                    marginTop: "315px",
                                                    width: "235px",
                                                    height: "235px",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    width: "100%",
                                                    marginLeft: "-330px",
                                                    fontSize: "16px",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    marginTop: "89%",
                                                    textAlign: "center",
                                                    lineHeight: "8px"
                                                }}
                                            >
                                                <p>{fullName}</p>
                                                <p>   {designation}</p>
                                            </div>
                                            {/* <div
                        style={{
                          width: "100%",
                          marginLeft: "-400px",
                          fontSize: "16px",
                          color: "#000",
                          fontWeight: 700,
                          marginTop: "503px",
                          textAlign:"center",

                        }}
                      >
                     
                      </div> */}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <div  className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <button
              className="btn btn-success"
              onClick={download}
              style={{ margin: "20px" ,justifyContent:"center"}}
            >
              Download
            </button>
          </div> */}
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-6 text-center">
                                <button
                                    className="btn btn-success btn-block"
                                    onClick={download}
                                    style={{ margin: "20px" }}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ImageCrp;
