
import {
  Search,
  ClipboardList,
  Wrench,
  CreditCard,
  ArrowRight,
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
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            Simple Process
          </p>

          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            How FixMate Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            Getting your devices repaired has never been easier.
            Follow four simple steps to get your problem fixed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <div className="h-full rounded-2xl border border-border bg-background p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-widest text-primary">
                      STEP {step.number}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={27} />
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {step.description}
                  </p>
                </div>

                {/* Desktop connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-primary lg:block">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
