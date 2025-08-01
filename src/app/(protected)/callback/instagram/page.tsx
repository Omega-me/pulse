import { onIntegrateInstagram } from "@/actions/integrations";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    code: string;
  }>;
}

const Page = async (props: Props) => {
  const { code } = await props.searchParams;
  if (code) {
    const user = await onIntegrateInstagram(code);
    if (user.status === 200) {
      return redirect(
        "/dashboard/integrations?message=Instagram Integration successful"
      );
    }
  }

  return redirect(
    "/dashboard/integrations?message=Instagram Integration failed"
  );
};

export default Page;
