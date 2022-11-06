import React, { useEffect, useState, useMemo } from "react";
import PostList from "components/PostList";
import AppLayout from "components/AppLayout";
import SuggestionList from "components/SuggestionList";

import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/useFetch";
import MiniProfile from "components/MiniProfile";

import { useAppContext } from "appStore";

function Home() {
  const navigate = useNavigate();
  const handleClick = (e) => {
    navigate("/posts/new/");
  };

  const [profile, setProfile] = useState();

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: `/accounts/profile/my/`,
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
