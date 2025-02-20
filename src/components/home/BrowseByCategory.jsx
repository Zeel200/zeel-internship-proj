import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import NFT from "../../images/nft.png";
import backgroundImage from "../../images/bg-shape-1.jpg";
import { Link } from "react-router-dom";

const Landing = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
    <section id="section-category" className="no-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>Browse by category</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>
            {[
              "fa-image",
              "fa-music",
              "fa-search",
              "fa-globe",
              "fa-vcard",
              "fa-th",
            ].map((icon, index) => (
              <div
                className="col-md-2 col-sm-4 col-6 mb-sm-30"
                key={index}
                data-aos="fade-left"
              >
                <Link to="/explore" className="icon-box style-2 rounded">
                  <i className={`fa ${icon}`}></i>
                  <span>
                    {
                      [
                        "Art",
                        "Music",
                        "Domain Names",
                        "Virtual Worlds",
                        "Trading Cards",
                        "Collectibles",
                      ][index]
                    }
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
