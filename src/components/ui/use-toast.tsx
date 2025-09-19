// Inspired by react-hot-toast
import { useState, useEffect } from "react";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1_000_000 as const;

type ActionType = "ADD_TOAST" | "UPDATE_TOAST" | "DISMISS_TOAST" | "REMOVE_TOAST";

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const satisfies Record<ActionType, ActionType>;

let count = 0;
function genId(): string {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}

/** Shape of a toast item kept in memory/state */
export type ToastData = {
    id: string;
    open: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    /** Called by the UI component when visibility changes (closes triggers dismiss). */
    onOpenChange?: (open: boolean) => void;
    /** Allow extra styling/variant props to pass-through to your <Toast /> */
    variant?: "default" | "destructive";
    className?: string;
    // Add other fields you want to support…
    // e.g. duration?: number;
    [key: string]: unknown;
};

type State = { toasts: ToastData[] };

type AddToastAction = {
    type: typeof actionTypes.ADD_TOAST;
    toast: ToastData;
};

type UpdateToastAction = {
    type: typeof actionTypes.UPDATE_TOAST;
    toast: Partial<ToastData> & Pick<ToastData, "id">;
};

type DismissToastAction = {
    type: typeof actionTypes.DISMISS_TOAST;
    toastId?: string;
};

type RemoveToastAction = {
    type: typeof actionTypes.REMOVE_TOAST;
    toastId?: string;
};

type Action = AddToastAction | UpdateToastAction | DismissToastAction | RemoveToastAction;

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

const clearFromRemoveQueue = (toastId: string) => {
    const timeout = toastTimeouts.get(toastId);
    if (timeout) {
        clearTimeout(timeout);
        toastTimeouts.delete(toastId);
    }
};

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action;

            // enqueue removal
            if (toastId) addToRemoveQueue(toastId);
            else state.toasts.forEach((t) => addToRemoveQueue(t.id));

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    toastId === undefined || t.id === toastId ? { ...t, open: false } : t
                ),
            };
        }

        case actionTypes.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return { ...state, toasts: [] };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };

        default:
            return state;
    }
};

type Listener = (state: State) => void;
const listeners: Listener[] = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
}

type ToastOptions = Omit<Partial<ToastData>, "id" | "open" | "onOpenChange">;

function toast(opts: ToastOptions = {}) {
    const id = genId();

    const update = (patch: ToastOptions) =>
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...patch, id },
        });

    const dismiss = () => {
        clearFromRemoveQueue(id);
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
    };

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            id,
            open: true,
            ...opts,
            onOpenChange: (open: boolean) => {
                if (!open) dismiss();
            },
        },
    });

    return { id, dismiss, update };
}

function useToast() {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) listeners.splice(index, 1);
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) =>
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    };
}

export { useToast, toast };
