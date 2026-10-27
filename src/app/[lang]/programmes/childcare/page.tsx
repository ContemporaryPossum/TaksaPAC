import { ProgrammeDetail, programmeMetadata } from "@/components/programme-detail";

export async function generateMetadata({ params }: PageProps<"/[lang]/programmes/childcare">) {
  return programmeMetadata(params, "childcare");
}

export default function Page({ params }: PageProps<"/[lang]/programmes/childcare">) {
  return <ProgrammeDetail params={params} programme="childcare" />;
}
