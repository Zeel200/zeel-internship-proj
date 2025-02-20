import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        const data = await response.json();
        setItemData(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [nftId]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">
                  <Skeleton height={400} width="100%" />
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <h2><Skeleton width={200} /></h2>
                    <div className="item_info_counts">
                      <Skeleton width={80} />
                    </div>
                    <p><Skeleton count={3} /></p>
                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <Skeleton circle={true} height={50} width={50} />
                        <Skeleton width={100} />
                      </div>
                    </div>
                    <h6>Price</h6>
                    <Skeleton width={80} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={itemData.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={itemData.title}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{itemData.title}</h2>
                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i> {itemData.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i> {itemData.likes}
                    </div>
                  </div>
                  <p>{itemData.description}</p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${itemData.ownerId}`}>
                            <img className="lazy" src={itemData.ownerImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${itemData.ownerId}`}>{itemData.ownerName}</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6>Price</h6>
                  <div className="nft-item-price">
                    <img src={EthImage} alt="" />
                    <span>{itemData.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
