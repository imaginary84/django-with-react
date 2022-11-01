import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppContext } from "appStore";
import PostList2 from "components/PostList2";

import "./accounts.scss";
import { useParams } from "react-router-dom";

function Profile() {
  const { store, dispatch } = useAppContext();
  const { access, refresh } = store;
  const headers = { Authorization: `Bearer ${access}` };
  const params = useParams();

  const [profile, setProfile] = useState(null);

  const profileFetch = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/accounts/profile/${params.username}/`,
        headers,
      });
      setProfile(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    profileFetch();
  }, []);

  return (
    <div>
      {profile && (
        <div className="layout">
          <div className="profile-1">
            <div className="profile-1-1">
              <img
                className="avatar"
                src={"http://localhost:8000" + profile.avatar_url}
                alt="testuser4"
              />
            </div>
            <div className="profile-1-2">
              <div className="controll">
                <div className="id">{profile.username}</div>
                <div className="edit-profile">
                  <button>프로필편집</button>
                </div>
                <div className="setup">
                  <button>설정</button>
                </div>
              </div>
              <div className="postfollow">
                <div className="gap">게시물 {profile.post_cnt} </div>
                <div className="gap pointer">
                  팔로워 {profile.follower_set.length}
                </div>
                <div className="gap pointer">
                  팔로우 {profile.following_set.length}
                </div>
              </div>
              <div className="name">{profile.name}</div>
            </div>
          </div>
          <div className="my-posts">
            <PostList2 username={profile.username} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
