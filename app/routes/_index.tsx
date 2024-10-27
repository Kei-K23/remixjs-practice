import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import prisma from "~/lib/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return json({ posts });
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between gap-x-4">
        <h1 className="text-lg font-semibold text-emerald-500">Blog Posts</h1>
        <Button asChild>
          <Link to={"/posts/new"}>Create New Post</Link>
        </Button>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p className="my-8 text-center text-muted-foreground">No post yet!</p>
      )}
    </div>
  );
}
