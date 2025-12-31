import React, { useEffect, useState } from "react";
import UserLayout from "../layout/UserLayout";
import { useNavigate } from "react-router-dom";
import { useUploadAvatarMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";

const UploadAvatar = () => {
  const { user } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || "/images/default_avatar.jpg"
  );

  const navigate = useNavigate();
  const [uploadAvatar, { isLoading, error, isSuccess }] =
    useUploadAvatarMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (isSuccess) {
      toast.success("Avatar Uploaded");
      navigate("/me/profile");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      avatar,
    }


    uploadAvatar(userData);
  };

  const onChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
    
      }
    }

    reader.readAsDataURL(e.target.files[0]);
    
  };

  return (
    <UserLayout>
      <></>
  <MetaData title={"Upload Avatar"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Upload Avatar</h2>

            <div className="mb-3 d-flex align-items-center">
              <figure className="me-3">
                <img
                  src={avatarPreview}
                  className="rounded-circle"
                  width="60"
                  height="60"
                />
              </figure>

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={onChange}
              />
            </div>

            <button className="btn w-100" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UploadAvatar;
