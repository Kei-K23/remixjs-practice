import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import prisma from "~/lib/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return json({ post });
};

export default function PostIdPage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-500 hover:underline">
            ← Back to Posts
          </Link>
        </div>

        <article className="prose lg:prose-xl">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-4">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="whitespace-pre-wrap">{post.content}</div>
        </article>

        <div className="flex gap-4 mt-8">
          <Button asChild>
            <Link to={`/posts/edit/${post.id}`}>Edit Post</Link>
          </Button>
          <Button asChild variant="destructive">
            <Link to={`/posts/${post.id}/delete`}>Delete Post</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
