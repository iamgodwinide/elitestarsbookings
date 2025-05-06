import ServiceComponent from "./ServiceComponent";

export default async function BookingPage({ params }: any) {
  const _params = await params;
  return <ServiceComponent params={_params}/>;
}
