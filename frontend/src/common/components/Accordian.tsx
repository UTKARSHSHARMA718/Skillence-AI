import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface AccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg bg-white shadow-sm w-full">
      <button
        className="w-full flex items-center justify-between p-4 text-left gap-2 cursor-pointer transition-colors"
        onClick={() => setOpen(!open)}
      >
        {header}
        <FaChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>

      {open && <div className="p-4">{children}</div>}
    </div>
  );
};
