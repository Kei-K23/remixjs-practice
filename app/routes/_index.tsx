import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import prisma from "~/lib/db.server";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
        <div className="space-y-5">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <Link to={`/posts/${post.id}`}>
                  <CardTitle className="cursor-pointer truncate text-xl font-semibold hover:underline">
                    {post.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="line-clamp-5">
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-x-3 mt-5">
                <Button variant={"secondary"} asChild>
                  <Link to={`/posts/edit/${post.id}`}>Edit</Link>
                </Button>
                <Button variant={"destructive"}>Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="my-8 text-center text-muted-foreground">No post yet!</p>
      )}
    </div>
  );
}
