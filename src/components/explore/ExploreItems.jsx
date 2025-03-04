import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?page=1`
        );
        const data = await response.json();
        const filtered = data.filter(item => item.expiryDate > Math.floor(Date.now() / 1000));
        setItems(filtered);
        setFilteredItems(filtered.map(item => ({
          ...item,
          timer: Math.max(item.expiryDate - Math.floor(Date.now() / 1000), 0),
        })));
      } catch (error) {
        console.error("Error fetching explore items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          timer: Math.max(item.expiryDate - Math.floor(Date.now() / 1000), 0),
        })).filter(item => item.timer > 0)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setFilteredItems(items.map(item => ({
        ...item,
        timer: Math.max(item.expiryDate - Math.floor(Date.now() / 1000), 0),
      })));
      return;
    }
    let sortedItems = [...filteredItems];
    if (value === "price_low_to_high") {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (value === "price_high_to_low") {
      sortedItems.sort((a, b) => b.price - a.price);
    } else if (value === "likes_high_to_low") {
      sortedItems.sort((a, b) => b.likes - a.likes);
    }
    setFilteredItems(sortedItems);
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.min(2, Math.floor(seconds / 3600))).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <>
      <div>
        <select id="filter-items" defaultValue="" onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      <div className="row">
        {loading
          ? new Array(4).fill(0).map((_, index) => (
            <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div className="skeleton skeleton-item">
                <div className="skeleton-img"></div>
                <div className="skeleton-title"></div>
              </div>
            </div>
          ))
          : filteredItems.slice(0, showMore ? 8 : 4).map((item, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", position: "relative" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author/${item.authorId}`}>
                    <img
                      className="lazy"
                      src={item.authorImage}
                      alt={item.authorName}
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                {item.timer > 0 && (
                  <div
                    className="countdown-timer"
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "5px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#000",
                      backgroundColor: "#fff",
                      border: "2px solid #7D4AEA",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {formatTime(item.timer)}
                  </div>
                )}

                <div className="nft__item_wrap">
                  <Link to={`/item-details/${item.nftId}`}>
                    <img
                      src={item.nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title}
                    />
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
      </div>

      <div className="col-md-12 text-center">
        {!loading && !showMore && items.length > 4 && (
          <button
            id="loadmore"
            className="btn-main lead"
            onClick={() => setShowMore(true)}
          >
            Load more
          </button>
        )}
      </div>
    </>
  );
};

export default ExploreItems;
