"use client";

import { SectionHeading } from "@/components/bits/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function FAQ() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered."
          subtitle="The objections we hear most — addressed head-on."
        />

        <div className="max-w-3xl mx-auto mt-10">
          <Accordion type="single" collapsible className="flex flex-col gap-2">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className={cn(
                  "glass-card px-4 border-b-0 rounded-[10px] data-[state=open]:border-[var(--accent)]/30 border border-[var(--border)]"
                )}
              >
                <AccordionTrigger className="text-[14px] font-semibold text-left py-4 hover:text-[var(--accent)] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[13px] text-[var(--text-secondary)] leading-[1.6] pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
