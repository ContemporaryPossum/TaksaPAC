import { ProgrammeDetail, programmeMetadata } from "@/components/programme-detail";

export async function generateMetadata({ params }: PageProps<"/[lang]/programmes/full-montessori">) {
  return programmeMetadata(params, "fullMontessori");
}

export default function Page({ params }: PageProps<"/[lang]/programmes/full-montessori">) {
  return <ProgrammeDetail params={params} programme="fullMontessori" />;
}
