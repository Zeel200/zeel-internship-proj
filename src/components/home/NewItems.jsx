import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// Separate countdown component to isolate timer updates from carousel
const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  
  useEffect(() => {
    if (!expiryDate) return;
    
    const updateTime = () => {
      const now = new Date().getTime();
      const targetTime = new Date(expiryDate).getTime();
      const diff = targetTime - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0");

        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      } else {
        setTimeLeft("00:00:00");
      }
    };
    
    // Initial update
    updateTime();
    
    // Set up interval
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);
  
  return <div className="de_countdown">{timeLeft}</div>;
};

// NFT Item component to further isolate rendering
const NFTItem = ({ item }) => {
  return (
    <div className="nft__item">
      {item.expiryDate && <CountdownTimer expiryDate={item.expiryDate} />}
      <div className="author_list_pp">
        <Link
          to={`/author/${item.authorId}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={`Creator: ${item.authorName}`}
        >
          <img className="lazy" src={item.authorImage} alt={item.authorName} />
          <i className="fa fa-check"></i>
        </Link>
      </div>
      <div className="nft__item_wrap">
        <Link to={`/item-details/${item.nftId}`}>
          <img src={item.nftImage} className="lazy nft__item_preview" alt={item.title} />
        </Link>
      </div>
      <div className="nft__item_info">
        <Link to={`/item-details/${item.nftId}`}>
          <h4>{item.title}</h4>
        </Link>
        <div className="nft__item_price">{item.price} ETH</div>
        <div className="nft__item_like">
          <i className="fa fa-heart"></i>
          <span>{item.likes}</span>
        </div>
      </div>
    </div>
  );
};

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselKey, setCarouselKey] = useState(Date.now());

  // Load data only once
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

  // Handle manual re-initialization if needed
  const reinitializeCarousel = useCallback(() => {
    setCarouselKey(Date.now());
  }, []);

  // This prevents the timer updates from re-rendering the carousel
  const carouselOptions = {
    items: 4,
    nav: true,
    dots: true,
    autoplay: false, // Disabled autoplay to avoid conflicts
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    freeDrag: false,
    stagePadding: 0,
    merge: false,
    mergeFit: true,
    autoWidth: false,
    startPosition: 0,
    rtl: false,
    smartSpeed: 250,
    fluidSpeed: false,
    dragEndSpeed: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
    },
    responsiveRefreshRate: 200,
    responsiveBaseElement: window,
    fallbackEasing: "swing",
    info: false,
    nestedItemSelector: false,
    itemElement: "div",
    stageElement: "div",
    refreshClass: "owl-refresh",
    loadedClass: "owl-loaded",
    loadingClass: "owl-loading",
    rtlClass: "owl-rtl",
    responsiveClass: "owl-responsive",
    dragClass: "owl-drag",
    itemClass: "owl-item",
    stageClass: "owl-stage",
    stageOuterClass: "owl-stage-outer",
    grabClass: "owl-grab",
    navContainerClass: "owl-nav",
    dotsClass: "owl-dots",
    dotsEach: false,
    slideBy: 1
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
                  <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Skeleton circle={true} height={50} width={50} style={{ marginBottom: "10px" }} />
                      </div>
                      <div className="nft__item_wrap">
                        <Skeleton height={200} />
                      </div>
                      <div className="nft__item_info">
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newItems.length > 0 ? (
              // Use a key to force re-initialization if needed, but no dynamically changing keys
              <OwlCarousel className="owl-theme" {...carouselOptions} key={carouselKey}>
                {newItems.map((item) => (
                  <div className="item" key={item.nftId}>
                    <NFTItem item={item} />
                  </div>
                ))}
              </OwlCarousel>
            ) : (
              <p className="text-center">No new items available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;