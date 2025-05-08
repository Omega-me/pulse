import { onIntegrate } from '@/actions/integrations';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    code: string;
  }>;
}

const Page = async (props: Props) => {
  const { code } = await props.searchParams;
  if (code) {
    const user = await onIntegrate(code);
    if (user.status === 200) {
      return redirect('/dashboard/integrations');
    }
  }

  return redirect('/sign-up');
};

export default Page;
