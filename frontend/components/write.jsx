import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import DOMPurify from "dompurify";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import moment from "moment";
import { authContext } from "../context/authContext";
import Modal from "./modal";

const Write = () => {
  const [showModal, setshowModal] = useState(false);
  const state = useLocation().state || [];
  console.log(state);
  const { user } = useContext(authContext);
  console.log(user);
  const [showtext, setShowtext] = useState(false);
  console.log();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  // const objValues = state[0]
  // console.log(objValues)
  const [searchParams] = useSearchParams();
  const paramID = searchParams.get("edit");
  console.log(searchParams.get("edit"));
  console.log(paramID);
  const [postDetails, setPostDetails] = useState({
    title: state[0]?.title || "",
    desc: state[0]?.desc || "",
    cat: state[0]?.cat || "",
    file:
      state[0]?.img || state[0]?.postImg
        ? { name: state[0]?.img || state[0]?.postImg, isUploaded: true }
        : { name: "", isUploaded: false },
    status: state[0]?.status,
  });
  console.log(postDetails.file);
  useEffect(() => {
    if (!paramID) {
      setPostDetails({
        title: "",
        desc: "",
        cat: "",
        file: { name: "", isUploaded: false },
      });
    }
  }, [paramID]);
  // console.log(state[0]?.img);
  //  console.log(file);
  // console.log(file.name);
  const navigate = useNavigate();

  const upload = async () => {
    try {
      console.log(file);
      console.log(postDetails);
      if (postDetails.file?.isUploaded) {
        // If the file is already uploaded, skip re-uploading
        console.log("Using existing image:", postDetails.file.name);
        return postDetails.file.name; // Return the existing filename
      }
      const selectedFile = postDetails.file?.fileObject;
      console.log(postDetails.file.fileObject);
      if (!(selectedFile instanceof File)) {
        console.error("Invalid file format or no file selected");
        return null;
      }
      const formData = new FormData();
      formData.append("file", selectedFile); // Use the actual File object
      console.log("Uploading file:", selectedFile.name);

      const res = await axios.post("http://localhost:3006/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(value)
  // let hasUndefined;
  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl;

    // Check if the file is already uploaded or needs to be uploaded
    if (file.isUploaded) {
      console.log("Using existing image:", file.name);
      imgUrl = file.name; // Use the existing image name
    } else {
      imgUrl = await upload(); // Upload and get the new URL
      console.log("Uploaded Image URL:", imgUrl);
    }

    const cleanContent = DOMPurify.sanitize(postDetails.desc, {
      ALLOWED_TAGS: [],
    });
    console.log("Clean Content:", cleanContent);
    //console.log(value);

    const updatedPostDetails = {
      ...postDetails,
      desc: cleanContent,
      img: imgUrl,
      date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      status: "published",
    };
    console.log(postDetails);
    console.log(updatedPostDetails);
    setPostDetails(updatedPostDetails);
    const hasUndefined = Object.values(updatedPostDetails).some(
      (value) => value === "" || value === "<p><br></p>"
    );

    console.log(hasUndefined);
    if (hasUndefined) {
      setShowtext(true);
      return;
    }
    if (!user?.ID) {
      console.log(true);

      setshowModal(true);
      return;
    }
    //  const imgUrl = await upload();
    // if (!state.id) {
    //   console.error("Post ID is missing.");
    //   return;
    // }

    // console.log(file);

    try {
      console.log("Final postDetails object:", updatedPostDetails);

      state.length != 0
        ? await axios.put(
            `http://localhost:3006/cat/${state[0].id}`,
            {
              postDetails: updatedPostDetails,
            },
            { withCredentials: true }
          )
        : await axios.post(
            `http://localhost:3006/cat/addPost/`,
            {
              postDetails: updatedPostDetails,
            },
            { withCredentials: true }
          );
      setPopupMessage(
        `Blog ${updatedPostDetails.status} successfully! Redirecting...`
      );
      setShowPopup(true);
      // console.log(postDetails)
      setTimeout(() => {
        navigate("/home");
      }, 3000);
      // setPostDetails({})
    } catch (err) {
      console.log(err);
    }
  };
  console.log();
  const handleDraft = async (e) => {
    e.preventDefault();
    const hasUndefined = Object.values(postDetails).some(
      (value) => value === "" || value === "<p><br></p>" || value.name == ""
    );

    console.log(hasUndefined);
    if (hasUndefined) {
      setShowtext(true);
      return;
    }
    if (!user?.ID) {
      console.log(true);

      return setshowModal(true);
    }
    const cleanContent = DOMPurify.sanitize(postDetails.desc, {
      ALLOWED_TAGS: [],
    });
    let imgUrl;
    if (postDetails.file?.isUploaded) {
      console.log("Using existing image:", postDetails.file.name);
      imgUrl = postDetails.file.name; // Use the existing image name
    } else {
      imgUrl = await upload(); // Upload and get the new URL
      console.log("Uploaded Image URL:", imgUrl);
    }

    // const imgUrl = await upload();
    // console.log(imgUrl);

    const updatedPostDetails = {
      ...postDetails,
      desc: cleanContent,
      img: imgUrl,
      date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      status: "draft",
    };
    setPostDetails(updatedPostDetails);
    if (state.length != 0) {
      try {
        console.log("Final postDetails object:", updatedPostDetails);

        const res = await axios.put(
          `http://localhost:3006/cat/${state[0].id}`,
          {
            postDetails: updatedPostDetails,
          },
          { withCredentials: true }
        );
        console.log("drafted");
        console.log(res);
        setPopupMessage(
          `Blog ${updatedPostDetails.status} successfully! Redirecting...`
        );
        setShowPopup(true);
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } else {
      await axios.post(
        `http://localhost:3006/cat/addPost/`,
        {
          postDetails: updatedPostDetails,
        },
        { withCredentials: true }
      );
      setPopupMessage(
        `Blog ${updatedPostDetails.status} successfully! Redirecting...`
      );
      setShowPopup(true);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    }
  };
  // console.log(showModal);
  console.log(showPopup);

  return (
    <>
      <div className="add">
        {showPopup && (
          <div className="overlaypop">
            <div className="popup">
              <p>{popupMessage}</p>
            </div>
          </div>
        )}
        {showModal && (
          <Modal
            showModal={showModal}
            showtext={showtext}
            setShowtext={setShowtext}
            setshowModal={setshowModal}
          />
        )}
        <div className="content">
          <input
            type="text"
            placeholder="Title"
            value={postDetails.title}
            onChange={(e) => {
              setShowtext(false);
              setPostDetails((prevState) => ({
                ...prevState,
                title: e.target.value,
              }));
            }}
          />
          <div className="editorContainer">
            <ReactQuill
              className="editor"
              theme="snow"
              value={postDetails.desc}
              onChange={(value) => {
                setShowtext(false);
                setPostDetails((prevState) => ({
                  ...prevState,
                  desc: value,
                }));
              }}
            />
          </div>
        </div>
        <div className="menu">
          <div className="item">
            <h1 className="boxcontent">Publish</h1>
            <span className="boxcontent">
              <b>Status: </b> {state.length != 0 ? state[0]?.status : "None"}
            </span>{" "}
            <br></br>
            <span className="boxcontent">
              <b>Visibility: </b> Public
            </span>
            <br></br>
            <input
              style={{ display: "none" }}
              type="file"
              id="file"
              name="file"
              onChange={(e) => {
                setShowtext(false);
                const file = e.target.files[0];
                console.log(file)
                setPostDetails((prev) => ({
                  ...prev,
                  file: {
                    name: file.name,
                    isUploaded: false,
                    fileObject: file,
                  },
                }));
              }}
            />
            <label className="file" htmlFor="file">
              Upload Image
            </label>
            <div className="buttons">
              <button onClick={handleDraft}>Save as a draft</button>
              <button onClick={handleClick}>
                {paramID != null ? (
                  state[0].status == "draft" ? (
                    <p>Update and publish</p>
                  ) : (
                    <p>Update</p>
                  )
                ) : (
                  <p>Publish</p>
                )}
              </button>
            </div>
          </div>
          <div className="item">
            <h1>Category</h1>
            <div className="cat">
              <input
                type="radio"
                checked={postDetails.cat === "art"}
                name="cat"
                value="art"
                id="art"
                onChange={(e) => {
                  setShowtext(false);
                  setPostDetails({
                    ...postDetails,
                    cat: e.target.value,
                  });
                }}
              />
              <label htmlFor="art">Art</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={postDetails.cat === "science"}
                name="cat"
                value="science"
                id="science"
                onChange={(e) => {
                  setShowtext(false);
                  setPostDetails({
                    ...postDetails,
                    cat: e.target.value,
                  });
                }}
              />
              <label htmlFor="science">Science</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={postDetails.cat === "technology"}
                name="cat"
                value="technology"
                id="technology"
                onChange={(e) => {
                  setShowtext(false);
                  setPostDetails({
                    ...postDetails,
                    cat: e.target.value,
                  });
                }}
              />
              <label htmlFor="technology">Technology</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={postDetails.cat === "cinema"}
                name="cat"
                value="cinema"
                id="cinema"
                onChange={(e) => {
                  setShowtext(false);
                  setPostDetails({
                    ...postDetails,
                    cat: e.target.value,
                  });
                }}
              />
              <label htmlFor="cinema">Cinema</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={postDetails.cat === "design"}
                name="cat"
                value="design"
                id="design"
                onChange={(e) => {
                  setShowtext(false);

                  setPostDetails({
                    ...postDetails,
                    cat: e.target.value,
                  });
                }}
              />
              <label htmlFor="design">Design</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={postDetails.cat === "food"}
                name="cat"
                value="food"
                id="food"
                onChange={(e) => {
                  setShowtext;
                  setPostDetails({
                    ...postDetails,
                    cat: e.target.value,
                  });
                }}
              />
              <label htmlFor="food">Food</label>
            </div>
          </div>
        </div>
      </div>{" "}
      {showtext && (
        <p className="error-message">
          Please fill out all the required fields.
        </p>
      )}
    </>
  );
};

export default Write;
