import CelebrityComponent from "./CelebrityComponent";

export default async function EditCelebrityPage({ params }: any) {
    const _params = await params;
    return <CelebrityComponent
        params={_params}
    />
}
