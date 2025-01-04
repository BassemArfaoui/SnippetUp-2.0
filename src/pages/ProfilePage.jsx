import ProfileBody from "../components/profile/ProfileBody";
import ProfileCard from "../components/profile/ProfileCard";
import { Card, Divider } from "@mui/material";
import "../css/ProfilePage.css";
import { Helmet } from "react-helmet";

function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>SnippetUp : Profile</title>
      </Helmet>
      <div className="profile-page py-3 pb-2 px-3">
        <Card className=" profile-card w-100  rounded-4">
          <ProfileCard />

          <Divider
            variant="middle"
            flexItem
            className="mt-3"
            sx={{
              borderColor: "gray",
              borderWidth: "1pt",
            }}
          />
        </Card>
        <ProfileBody />
      </div>
    </>
  );
}

export default ProfilePage;
