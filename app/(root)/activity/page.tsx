import { fetchUser, getActivities } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  console.log(userInfo, "user");
  if (!userInfo?.onboarded) redirect("/onboarding");
  //getActivities
  const activitys = await getActivities(userInfo?._id);

  return (
    <section>
      <h1 className="head-text">Activity </h1>
      <section className="mt-10 flex flex-col gap-5">
        {activitys.length > 0 ? (
          <>
            {activitys.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="author"
                    width={20}
                    height={20}
                    className=" rounded-full object-cover"
                  />
                  <p className=" !text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500 ">{activity.author.name}</span>
                    {" "} replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className=" !text-base-regular text-light-3">No Activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
