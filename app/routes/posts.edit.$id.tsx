import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
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

export async function action({ request, params }: ActionFunctionArgs) {
  const body = await request.formData();
  const title = body.get("title") as string;
  const content = body.get("content") as string;

  await prisma.post.update({
    where: { id: params.id },
    data: {
      title,
      content,
    },
  });

  return redirect(`/`);
}

export default function PostEditIdPage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Posts
        </Link>
      </div>

      <Form method="POST" className="space-y-3 mt-4">
        <Input
          defaultValue={post.title}
          name="title"
          placeholder="Title"
          required
        />
        <Textarea
          defaultValue={post.content}
          name="content"
          placeholder="Content"
          rows={10}
          required
        />
        <Button type="submit">Save</Button>
      </Form>
    </div>
  );
}
