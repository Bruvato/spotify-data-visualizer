import { twMerge } from "tailwind-merge";

export default function ContentWrapper({ children, className }) {
    return (
        <section
            className={twMerge(
                className,
                "px-12 py-12 rounded-2xl dark:bg-neutral-800 bg-neutral-200"
            )}
        >
            {children}
        </section>
    );
}
