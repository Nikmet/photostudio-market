import { PageTitle } from "@/components/page-title";
import { Profile } from "@/components/profile";

export default async function ProfilePage() {
    return (
        <>
            <PageTitle>Профиль клиента</PageTitle>
            <Profile orders={[]} />
        </>
    );
}
