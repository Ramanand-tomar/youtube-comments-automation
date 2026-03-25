import { WorkflowEditorPreview } from "@/sections/HowItWorksSection/components/WorkflowEditorPreview";
import { HowItWorksSteps } from "@/sections/HowItWorksSection/components/HowItWorksSteps";

export const HowItWorksSection = () => {
  return (
    <section data-uid="sHHruZ9dhokqUsCL" className="box-border caret-transparent max-w-none mx-auto px-2 py-9 md:max-w-[1230px] md:px-6 md:py-12">
      <hgroup data-uid="BAw0xiKUIV0tNuvm" className="items-center box-border caret-transparent flex flex-col text-center">
        <h2 data-uid="c9bP2OKAl0unkAB2" className="text-2xl font-semibold box-border caret-transparent tracking-[1px] leading-9 max-w-none min-h-[auto] min-w-[auto] pb-2 font-degular_display md:text-5xl md:leading-[48px] md:max-w-[920px]">
          How BeyondChats works
        </h2>
        <p data-uid="jD5sMyjZN8ThZqwi" className="text-sm box-border caret-transparent leading-6 min-h-[auto] min-w-[auto] pb-2 font-inter">
          BeyondChats makes it easy to automate your YouTube comment replies - no code
          necessary. See how you can get setup in minutes.
        </p>
      </hgroup>
      <div data-uid="4OTSMU7KH4wNXVzl" className="box-border caret-transparent px-4 md:px-10">
        <WorkflowEditorPreview />
        <HowItWorksSteps />
      </div>
    </section>
  );
};
