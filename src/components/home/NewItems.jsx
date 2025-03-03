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
  const [countdowns, setCountdowns] = useState({});

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

  useEffect(() => {
    if (newItems.length === 0) return;

    const updateCountdowns = () => {
      const now = new Date().getTime();
      const newCountdowns = {};

      newItems.forEach((item) => {
        if (item.expiryDate) {
          const targetTime = new Date(item.expiryDate).getTime();
          const timeLeft = targetTime - now;

          if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60))
              .toString()
              .padStart(2, "0");
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
              .toString()
              .padStart(2, "0");
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
              .toString()
              .padStart(2, "0");

            newCountdowns[item.nftId] = `${hours}:${minutes}:${seconds}`;
          } else {
            newCountdowns[item.nftId] = "00:00:00";
          }
        }
      });

      setCountdowns(newCountdowns);
    };

    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [newItems]);

  const carouselOptions = {
    items: 4,
    nav: true,
    dots: true,
    autoplay: true,
    loop: false,
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
              <OwlCarousel className="owl-theme" {...carouselOptions} key={newItems.length}>
                {newItems.map((item) => (
                  <div className="item" key={item.nftId}>
                    <div className="nft__item">
                      {item.expiryDate && (
                        <div className="de_countdown">{countdowns[item.nftId] || "00:00:00"}</div>
                      )}
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
