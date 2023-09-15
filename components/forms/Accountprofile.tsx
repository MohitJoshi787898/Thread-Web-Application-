"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { isBase64Image } from "@/lib/utils";
import { ImageResponse } from "next/server";
import { useUploadThing } from "@/lib/uploadthings";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const Accountprofile = ({ user, btnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const pathname = usePathname();

  const router = useRouter();

  const { startUpload } = useUploadThing("media");
  
  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }
    //Update profile in backend
    await updateUser({
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      userId: user.id,
      path: pathname,
    });
    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) {
        return;
      }
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
        // console.log(file,"from")
      };
      fileReader.readAsDataURL(file);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-10 justify-start"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className=" flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profle photo"
                    width={96}
                    height={96}
                    priority
                    className=" rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    width={24}
                    height={24}
                    alt="profle photo"
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className=" flex-1 text-body-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-from_image-imput"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=" flex flex-col  gap-3 w-full">
              <FormLabel className=" text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-from_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className=" flex flex-col  gap-3 w-full">
              <FormLabel className=" text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-from_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className=" flex flex-col  gap-3 w-full">
              <FormLabel className=" text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-from_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <Button type="submit" className=" bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default Accountprofile;
