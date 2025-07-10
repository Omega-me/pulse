import { onIntegrateFacebook } from "@/actions/integrations";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    code: string;
  }>;
}

const Page = async (props: Props) => {
  const { code } = await props.searchParams;
  if (code) {
    const user = await onIntegrateFacebook(code);
    if (user.status === 200) {
      return redirect(
        "/dashboard/integrations?message=Facebook%20Integration%20successful"
      );
    }
  }

  return redirect(
    "/dashboard/integrations?message=Facebook%20Integration%20failed&code=" +
      code
  );
};

export default Page;
