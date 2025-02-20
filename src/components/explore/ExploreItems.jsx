import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?page=${page}`);
        const data = await response.json();
        setItems((prevItems) => [...prevItems, ...data.map((item) => ({
          ...item,
          timer: item.expiryDate - Math.floor(Date.now() / 1000),
        }))]);
      } catch (error) {
        console.error("Error fetching explore items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          const remainingTime = Math.max(item.expiryDate - 1, 0);
          return { ...item, timer: remainingTime };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div>
        <select id="filter-items" defaultValue="">
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      <div className="row">
        {loading && items.length === 0
          ? new Array(8).fill(0).map((_, index) => <div key={index} className="skeleton-item">Loading...</div>)
          : items.map((item, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to={`/author/${item.authorId}`}>
                      <img className="lazy" src={item.authorImage} alt={item.authorName} />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="de_countdown">{formatTime(item.expiryDate)}</div>

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
      </div>
      <div className="col-md-12 text-center">
        {!loading && (
          <button id="loadmore" className="btn-main lead" onClick={handleLoadMore}>
            Load more
          </button>
        )}
      </div>
    </>
  );
};

export default ExploreItems;
