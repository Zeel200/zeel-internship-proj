import React from "react";
import { Link } from "react-router-dom";

const AuthorItems = ({ nftCollection }) => {
  return (
    <div className="row">
      {nftCollection.map((item, index) => (
        <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
          <div className="nft__item">
            <div className="nft__item_wrap">
              <Link to={`/item-details/${item.nftId}`}>
                <img src={item.nftImage} className="lazy nft__item_preview" alt={item.title} />
              </Link>
            </div>
            <div className="nft__item_info">
              <Link to={`/item-details/nftid/${item.nftId}`}>
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
  );
};

export default AuthorItems;
