import { twMerge } from "tailwind-merge";

export default function ContentWrapper({ children, className }) {
    return (
        <section
            className={twMerge(
                className,
                "px-4 sm:px-6 lg:px-8 py-6 rounded-2xl dark:bg-neutral-800 bg-neutral-100 shadow-md"
            )}
        >
            {children}
        </section>
    );
}
