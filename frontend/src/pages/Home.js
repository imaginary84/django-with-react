import React, { useEffect, useState } from "react";
import PostList from "components/PostList";
import AppLayout from "components/AppLayout";
import StoryList from "components/StoryList";
import SuggestionList from "components/SuggestionList";

import { Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAppContext } from "appStore";
import MiniProfile from "components/MiniProfile";

function Home() {
  const navigate = useNavigate();
  const handleClick = (e) => {
    navigate("/posts/new/");
  };
  const {
    store: { access },
  } = useAppContext();

  const [profile, setProfile] = useState();

  const fetchProfile = async () => {
    try {
      const response = await Axios({
        method: "GET",
        url: `http://localhost:8000/accounts/profile/my/`,
        headers: { Authorization: `Bearer ${access}` },
      });

      setProfile(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const sidebar = (
    <>
      {profile && <MiniProfile profile={profile} />}
      <Button
        type="primary"
        onClick={handleClick}
        block
        style={{ marginBottom: "1rem" }}
      >
        새 포스팅 쓰기
      </Button>
      {/* <StoryList style={{ marginBottom: "1rem" }} /> */}
      <SuggestionList style={{ marginBottom: "1rem" }} />
    </>
  );

  return (
    <AppLayout sidebar={sidebar}>
      <PostList />
    </AppLayout>
  );
}

export default Home;
