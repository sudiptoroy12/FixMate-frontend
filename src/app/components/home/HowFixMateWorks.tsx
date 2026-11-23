
import {
  Search,
  ClipboardList,
  Wrench,
  CreditCard,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Explore repair services and choose the one that matches your needs.",
    icon: Search,
  },
  {
    number: "02",
    title: "Send a Request",
    description:
      "Describe your problem, provide your address, and select your preferred date.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Technician Fixes It",
    description:
      "Your technician accepts the request and completes the repair service.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Pay After Completion",
    description:
      "Once your repair is completed, pay for the service.",
    icon: CreditCard,
  },
];

export default function HowFixMateWorks() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f5f9f1] py-20 dark:bg-[#152923] sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#b9e769]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#167d68]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#167d68]/15 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#167d68] shadow-sm dark:border-[#65d4a6]/20 dark:bg-white/5 dark:text-[#65d4a6]">
            <Sparkles size={15} />
            Simple Process
          </div>

          <h2 className="text-3xl font-black tracking-tight text-[#18352e] dark:text-white sm:text-4xl lg:text-5xl">
            How Does
            <span className="mt-2 block bg-gradient-to-r from-[#167d68] to-[#73a928] bg-clip-text text-transparent dark:from-[#65d4a6] dark:to-[#b9e769]">
              FixMate Work?
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#71827a] dark:text-gray-400 sm:text-base">
            Getting your devices repaired has never been easier. Follow four
            simple steps and let our trusted technicians take care of the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {/* Desktop connecting line */}
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-[43px] hidden border-t-2 border-dashed border-[#167d68]/20 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="group relative">
                <div className="relative flex h-full flex-col rounded-3xl border border-[#167d68]/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#167d68]/30 hover:shadow-2xl hover:shadow-[#167d68]/10 dark:border-white/10 dark:bg-[#1b302b] dark:hover:border-[#65d4a6]/30 sm:p-7">
                  {/* Step number and icon */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-sm font-black tracking-[0.2em] text-[#167d68] dark:text-[#65d4a6]">
                      STEP {step.number}
                    </span>

                    <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-[#167d68]/10 bg-gradient-to-br from-[#e8f5d5] to-[#d9edcc] text-[#167d68] shadow-sm transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#167d68]/15 dark:border-[#65d4a6]/15 dark:from-[#24483a] dark:to-[#1b302b] dark:text-[#65d4a6]">
                      <Icon size={30} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Step progress indicator */}
                  <div className="mt-7 flex items-center gap-2">
                    <span className="h-1.5 w-10 rounded-full bg-[#167d68] transition-all duration-500 group-hover:w-16 dark:bg-[#65d4a6]" />
                    <span className="h-1.5 w-3 rounded-full bg-[#b9e769]" />
                    <span className="h-1.5 w-3 rounded-full bg-[#b9e769]/50" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-xl font-extrabold text-[#18352e] transition-colors duration-300 group-hover:text-[#167d68] dark:text-white dark:group-hover:text-[#65d4a6]">
                    {step.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-[#71827a] dark:text-gray-400">
                    {step.description}
                  </p>

                  {/* Bottom indicator */}
                  <div className="mt-7 flex items-center justify-between border-t border-[#167d68]/10 pt-4 dark:border-white/10">
                    <span className="text-xs font-bold text-[#167d68] dark:text-[#65d4a6]">
                      {index === 3 ? "You're all set!" : "Next step"}
                    </span>

                    {index === 3 ? (
                      <CheckCircle2
                        size={19}
                        className="text-[#167d68] dark:text-[#65d4a6]"
                      />
                    ) : (
                      <ArrowRight
                        size={19}
                        className="text-[#167d68] transition-transform duration-300 group-hover:translate-x-1 dark:text-[#65d4a6]"
                      />
                    )}
                  </div>
                </div>

                {/* Mobile/tablet connector */}
                {index !== steps.length - 1 && (
                  <div className="pointer-events-none absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 text-[#167d68]/40 sm:hidden">
                    <ArrowRight className="rotate-90" size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom message */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#167d68]/10 bg-white/70 px-5 py-6 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
            <Wrench size={22} />
          </div>

          <p className="text-sm font-semibold text-[#526b60] dark:text-gray-300">
            From booking to repair, FixMate makes the entire process simple
            and hassle-free.
          </p>
        </div>
      </div>
    </section>
  );
}
