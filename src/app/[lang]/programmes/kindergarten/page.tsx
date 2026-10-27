import { ProgrammeDetail, programmeMetadata } from "@/components/programme-detail";

export async function generateMetadata({ params }: PageProps<"/[lang]/programmes/kindergarten">) {
  return programmeMetadata(params, "kindergarten");
}

export default function Page({ params }: PageProps<"/[lang]/programmes/kindergarten">) {
  return <ProgrammeDetail params={params} programme="kindergarten" />;
}
