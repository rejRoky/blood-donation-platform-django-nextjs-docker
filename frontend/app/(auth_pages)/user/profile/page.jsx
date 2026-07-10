import UserProfile from "@/components/user/profile/UserProfile";

export const metadata = {
  title: "Dial For Blood-User Profile",
  description: "Donate your red love to save one's life",
};

const Profile = () => {
  return (
    <div className="min-h-[calc(100vh-105px)] md:me-3">
      <UserProfile />
    </div>
  );
};

export default Profile;
