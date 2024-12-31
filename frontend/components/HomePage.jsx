import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import './HomePage.scss';

export const HomePage = () => {
  const items = [
    {
      title: "Create a Stunning Blog",
      content:
        "Design your blog effortlessly with our modern, customizable themes. Choose from a variety of templates and add your personal touch using drag-and-drop tools. Express your unique style with custom fonts, colors, and layouts that suit your taste.",
    },
    {
      title: "Streamline Your Edits",
      content:
        "Edit your blog content quickly and efficiently with our intuitive editor. Make changes to text, images, and layouts in just a few clicks. Enjoy real-time previews and easily undo mistakes for a seamless editing experience.",
    },
    {
      title: "Effortless Sharing Options",
      content:
        "Reach your audience with integrated sharing tools. Publish your posts across social media platforms, email newsletters, or directly share the blog link. Expand your reach with one-click sharing options.",
    },
    {
      title: "Optimize for Mobile and SEO",
      content:
        "Ensure your blog looks perfect on any device with responsive designs. Improve discoverability with built-in SEO tools, including customizable meta descriptions, alt text for images, and fast-loading pages.",
    },
    {
      title: "Engage with Your Audience",
      content:
        "Interact with your readers through integrated comment sections, email subscriptions, and analytics tools. Understand your audience with detailed stats and improve your content based on their feedback.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    const backendUrl = "https://blog-2-gxa8.onrender.com"; // Correct backend URL
    fetch(`${backendUrl}/api/data`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data
        setData(data); // Set the data to state
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  console.log(data);
  return (
    <>
      <div className="app-wrapper">
        <div className="videoContainer">
          <div className="H-content">
            <h1>Backend Data: {data}</h1>
            <h1>Blog with the best.</h1>
            <h3>
              Join a community of visionary writers and thinkers. Explore
              insights that inspire and stories that captivate
            </h3>
          </div>

          <div className="white-box"></div>
          <div className="black-box"></div>
          <div className="overlay">
            <video
              className="video"
              src="/name.mp4"
              loop
              type="video/mp4"
              autoPlay
              muted
            />
          </div>
        </div>{" "}
        <div className="box-2">
          <h1>Ideas that Inspire</h1>
          <h3>
            Fuel your mind with creativity and innovation. Transform thoughts
            into actions that make an impact.
          </h3>
          <Link className="btn">Create Blog</Link>
        </div>
        <div className="box-3">
          <img src="https://images.unsplash.com/photo-1726672941260-07fbcabb3a96?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
          <div className="accordion">
            {items.map((item, index) => (
              <div
                key={index}
                className={`accordion-item ${
                  activeIndex === index ? "active" : ""
                }`}
              >
                <div
                  className="accordion-title"
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{activeIndex === index ? "▾" : "▸"}</span> {item.title}
                </div>
                {activeIndex === index && (
                  <div className="accordion-content">{item.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="imageContainer">
          {/* <div className="H-content">
            <h1></h1>
            <h3></h3>
          </div> */}

          <div className="white-box"></div>
          <div className="black-box"></div>
          <div className="overlay2">
            <img src="https://images.unsplash.com/photo-1496449903678-68ddcb189a24?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
          </div>

          <div className="content2">
            <h1>Elevate Your Blogging Experience</h1>
            <h3>
              Take your storytelling to new heights with powerful tools and
              seamless design options. Whether you're a beginner or a seasoned
              blogger, our platform offers everything you need to craft visually
              stunning posts, engage with your audience, and grow your reach
              effortlessly.
            </h3>
            <Link className="btn">Create Blog</Link>
          </div>
        </div>
        <div className="imageContainer">
          {/* <div className="H-content">
    <h1></h1>
    <h3></h3>
  </div> */}
          <div className="black-box"></div>
          <div className="white-box"></div>

          <div className="overlay2">
            <img
              src="https://wordpress.com/wp-content/uploads/2022/12/create-blog-chapter-one.png"
              alt="Blogging"
            />
          </div>

          <div className="content2 bg-white text-black h-[500px] mt-9">
            {" "}
            <h1>Elevate Your Blogging Experience</h1>
            <h3>
              Take your storytelling to new heights with powerful tools and
              seamless design options. Whether you're a beginner or a seasoned
              blogger, our platform offers everything you need to craft visually
              stunning posts, engage with your audience, and grow your reach
              effortlessly.
            </h3>
            <Link className="createBtn btn">Create Blog</Link>
          </div>
        </div>
      </div>
    </>
  );
};
