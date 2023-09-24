import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { Tabs } from "@radix-ui/react-tabs"
import { redirect } from "next/navigation"
import Image from "next/image"
import UserCard from "@/components/cards/UserCard"


const Page =async () => {
    const user =await currentUser()
    if(!user) return null
    const userInfo=await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')
    //Fetch users
const result=await fetchUsers({
    userId:user.id,
    searchString:'',
    pageNumber:1,
    pageSize:25
})
console.log(result.users.length,"userrs")
  return (
    <section>
        <h1 className="head-text">Search</h1>
        {/* Search Bar */}
      <div className=" mt-14 flex flex-col gap-9">
        {result.users.length===0?<p className="on-result">No Users</p>:(
            <>
            {result.users.map(person =>(
                <UserCard 
                id={person.id}
                key={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"


                />
            ))}
            </>
        )}</div>  
    </section>
  )
}

export default Page
