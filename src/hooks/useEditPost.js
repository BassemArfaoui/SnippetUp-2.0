import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useEditPost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId, postDetails }) => {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/edit-post/${postId}`,
        postDetails
      );
      return response.data;
    },
    {
      onSuccess: (updatedPost) => {
        queryClient.invalidateQueries(["posts"]);
      },
      onMutate: async ({ postId, postDetails }) => {
        await queryClient.cancelQueries(["posts"]);
        const previousPosts = queryClient.getQueryData(["posts"]);

        queryClient.setQueryData(["posts"], (oldData) =>
          oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId ? { ...post, ...postDetails } : post
            ),
          }))
        );

        return { previousPosts };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["posts"], context.previousPosts);
      },
    }
  );
};

export default useEditPost;
