import { twMerge } from "tailwind-merge";

export default function Wrapper({ children, className }) {
    return (
        <div
            className={twMerge(
                className,
                "mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
            )}
        >
            {children}
        </div>
    );
}
