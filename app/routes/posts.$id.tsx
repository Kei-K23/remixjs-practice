import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const id = body.get("id") as string;

  await prisma.post.delete({
    where: { id },
  });

  return redirect(`/`);
}

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Post</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  this blog post.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Form method="POST">
                  <input type="hidden" name="id" value={post.id} />
                  <Button variant={"destructive"}>Confirm</Button>
                </Form>
                <Button>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
