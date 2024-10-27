import { type ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import prisma from "~/lib/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const title = body.get("title") as string;
  const content = body.get("content") as string;

  await prisma.post.create({
    data: {
      title,
      content,
    },
  });
  return redirect(`/`);
}

export default function NewPost() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-xl">Create New Post</h1>
      <Form method="POST" className="space-y-3 mt-4">
        <Input name="title" placeholder="Title" required />
        <Textarea name="content" placeholder="Content" required />
        <Button type="submit">Create</Button>
      </Form>
    </div>
  );
}
