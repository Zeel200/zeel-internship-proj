import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const response = await fetch(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        const data = await response.json();
        setNewItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new items:", error);
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  const carouselOptions = {
    items: 4,
    nav: true,
    dots: true,
    autoplay: false, // Disable auto-scroll
    loop: true, // Enable looping
    margin: 10,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
    },
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12">
            {loading ? (
              <div className="row">
                {new Array(4).fill(0).map((_, index) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    key={index}
                  >
                    <div className="nft__item">
                      {/* Author Skeleton */}
                      <div className="author_list_pp">
                        <Skeleton
                          circle={true}
                          height={50}
                          width={50}
                          style={{ marginBottom: "10px" }}
                        />
                      </div>
                      {/* Item Image Skeleton */}
                      <div className="nft__item_wrap">
                        <Skeleton height={200} />
                      </div>
                      {/* Info Skeleton */}
                      <div className="nft__item_info">
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <OwlCarousel className="owl-theme" {...carouselOptions}>
                {newItems.map((item, index) => (
                  <div className="item" key={item.nftId || index}>
                    <div className="nft__item">
                      {/* Author */}
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${item.authorId}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={`Creator: ${item.authorName}`}
                        >
                          <img
                            className="lazy"
                            src={item.authorImage}
                            alt={item.authorName}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      {/* Item Image */}
                      <div className="nft__item_wrap">
                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={item.name}
                          />
                        </Link>
                      </div>
                      {/* Info */}
                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.name}</h4>
                        </Link>
                        <div className="nft__item_price">{item.price} ETH</div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </OwlCarousel>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
