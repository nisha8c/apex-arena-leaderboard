import { useToast } from "@/components/ui/use-toast";
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/ui/toast";
import * as React from "react";

// Drop conflicting props from the base: 'id' and the HTML 'title'
type ToastBaseProps = Omit<React.ComponentProps<typeof Toast>, "id" | "title">;

interface ToastItem extends ToastBaseProps {
    id: string; // keep string
    title?: React.ReactNode;        // our display title (not HTML title attr)
    description?: React.ReactNode;
    action?: React.ReactNode;
}

export function Toaster() {
    const { toasts } = useToast() as { toasts: ToastItem[] };

    return (
        <ToastProvider>
            {toasts.map(({ id, title, description, action, ...props }) => (
                <Toast key={id} {...props}>
                    <div className="grid gap-1">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && <ToastDescription>{description}</ToastDescription>}
                    </div>
                    {action}
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport />
        </ToastProvider>
    );
}
