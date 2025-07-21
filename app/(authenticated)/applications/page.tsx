import ApplicationsClient from "./ApplicationsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { getApplications } from "@/app/services/applicationsService";

export default async function Applications() {
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.id) {
  //   return <ApplicationsClient initialApplications={[]} />;
  // }
  // const applications = await getApplications(session?.user?.id);
  // return <div>Apps</div>;
  return <ApplicationsClient initialApplications={[]} />;
}
