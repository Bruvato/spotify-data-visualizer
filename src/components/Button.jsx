import React from "react";
import { cva } from "class-variance-authority";
import cn from "../utils/cn";

export default function Button({ children, className, variant, ...props }) {
    return (
        <button
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        >
            {children}
        </button>
    );
}

const buttonVariants = cva("", {
    variants: {
        variant: {
            primary: "font-bold py-2 px-4 text-center rounded-full",
            icon: "rounded-full flex justify-center items-center bg-neutral-900 dark:bg-neutral-100",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
});
