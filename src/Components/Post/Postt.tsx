import type { Post } from "../../Interfaces/PostInterface";
import { Avatar, Dropdown, Label, Typography, Button } from "@heroui/react";
import { Link } from "react-router-dom";
import CommentHeader from "../CommentHeader/CommentHeader";
import CreateComment from "../CreateComment/CreateComment";
import DeletePost from "../DeletePost/DeletePost";
import UpdatePost from "../UpdatePost/UpdatePost";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

const Postt = ({
  post,
  isPostDetails,
}: {
  post: Post;
  isPostDetails: boolean;
}) => {
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode<{ user: string }>(token).user : null;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="p-5 w-full sm:w-[95%] md:w-[60%] md:mx-auto">
      {/* Post Container */}
      <div className="posts bg-blue-300 rounded-md p-5 mb-5">
        <div className="post">
          <div className="header flex items-center justify-between mb-5">
            <div className="flex items-center ">
              <Avatar size="lg">
                <Avatar.Image alt="lkhh" src={post.user.photo}></Avatar.Image>
                <Avatar.Fallback>mero</Avatar.Fallback>
              </Avatar>
              <div className="name ms-6">
                <p>{post.user.name}</p>
                <p>{post.createdAt}</p>
              </div>
            </div>

            {user === post.user._id ? (
              <div className="action">
                <DeletePost id={post.id} />
              </div>
            ) : (
              ""
            )}

            {user === post.user._id && !isEditing ? (
              <div className="action mx-2 md:mx-2 lg:mx-0">
                <Button onClick={() => setIsEditing(true)}>Update</Button>
              </div>
            ) : null}
          </div>

          <div className="post-body mb-5">
            {isEditing ? (
              <UpdatePost post={post} onClose={() => setIsEditing(false)} />
            ) : (
              <>
                {post?.body ? (
                  <Typography type="h6" className="mb-5">
                    {post.body}
                  </Typography>
                ) : (
                  ""
                )}

                {post?.image ? (
                  <img src={post.image} className="w-full" alt="" />
                ) : (
                  ""
                )}

                {isPostDetails == false ? (
                  <Link
                    className="text-blue-500 my-4"
                    to={`postDetails/${post.id}`}
                  >
                    post Details
                  </Link>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {post?.topComment && isPostDetails == false ? (
        <div className="comment mt-3 mb-4 bg-blue-100 rounded-md ">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between">
              <Avatar size="lg">
                <Avatar.Image
                  alt="lkhh"
                  src={post.topComment.commentCreator.photo}
                ></Avatar.Image>
                <Avatar.Fallback>mero</Avatar.Fallback>
              </Avatar>
              <div className="name ms-6">
                <p>{post.topComment.commentCreator.name}</p>
                <p>{post.topComment.createdAt}</p>
              </div>
            </div>
            <div className="action">
              <Dropdown>
                <Button aria-label="Menu" variant="secondary">
                  ...
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    onAction={(key) => console.log(`Selected :${key}`)}
                  >
                    <Dropdown.Item id="edit-file" textValue="Edit file">
                      <Label>Edit file</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="delete-file"
                      textValue="Delete file"
                      variant="danger"
                    >
                      <Label>Delete file</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          </div>
          <p>{post.topComment.content}</p>
        </div>
      ) : (
        ""
      )}
      {post.commentsCount > 0 && isPostDetails == true ? (
        <CommentHeader id={post.id} />
      ) : (
        ""
      )}

      <CreateComment id={post.id} />
    </div>
  );
};

export default Postt;
