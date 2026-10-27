import { ProgrammeDetail, programmeMetadata } from "@/components/programme-detail";

export async function generateMetadata({ params }: PageProps<"/[lang]/programmes/nursery">) {
  return programmeMetadata(params, "nursery");
}

export default function Page({ params }: PageProps<"/[lang]/programmes/nursery">) {
  return <ProgrammeDetail params={params} programme="nursery" />;
}
