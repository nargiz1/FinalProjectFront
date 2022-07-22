import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as postServices from "../../../services/PostService";
import { setPosts } from "../../../redux/Post/PostSlice";
import CreatePost from "../../../components/CreatePost/CreatePost";
import Post from "../../../components/Post/Post";
import "../Feed/Feed.css";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import Advertisement from "../../../components/Advertisement/Advertisement";
import * as advServices from "../../../services/AdvService";
import { setAdvs } from "../../../redux/Adv/AdvSlice";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

function Feed() {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.post.posts);
  const advs = useSelector((state) => state.adv.adv);
  const user = useSelector((state) => state.user.currentUser);
  const [likeTest, setLikeTest] = useState(false);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 3,
  });
  console.log("posts", data);

  const page_limit = 3;

  const fetchData = async () => {
    const responseData = await postServices.getAllPostsService(
      pagination.skip,
      pagination.limit
    );
    dispatch(setPosts(responseData));
  };

  const handleShowMore = (e, _limit) => {
    e.preventDefault();
    setPagination({ ...pagination, limit: _limit });
  };

  useEffect(() => {
    (async function () {
      fetchData();
      const advs = await advServices.getAllAdv();
      dispatch(setAdvs(advs));
    })();
  }, [likeTest, pagination, dispatch]);

  let visitedPage = page_limit + pagination.limit;

  return (
    <div className="feed">
      <CreatePost />
      {data && data?.allPosts?.length > 0
        ? data.allPosts.map((item, index) => (
            <>
              {item.comments ? (
                <Post
                  post={item}
                  key={index}
                  likeTest={likeTest}
                  setLikeTest={setLikeTest}
                />)
                : 
                (
                  <Advertisement adv={item} />
                )
              }
            </>
          ))
        : null}

      {pagination.limit < data.count ? (
        <div className="d-flex justify-content-center mb-3">
          <div
            onClick={(e) => handleShowMore(e, visitedPage)}
            className="show-more"
          >
            <BsFillArrowDownCircleFill />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Feed;
