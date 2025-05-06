import ApplicationPageComponent from "./ApplicationPageComponent";

type Props = {
  params: {
    id: string;
    service: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function ApplicationPage({ params, searchParams }: any) {
  const _params = await params;
  return <ApplicationPageComponent params={_params} />;
}
