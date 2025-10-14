import { toast, type ExternalToast } from 'sonner';
import { v4 as uuid } from "uuid";
import { ToastCustom } from './ToastCustom';

export type ToastType = 'info' | 'warn' | 'error' | 'success' | 'default'

class AviancaToast {

    static show(title: string, type: ToastType = 'default', options: ExternalToast = {}) {
        const toastOptions: ExternalToast = {
            duration: 5000,
            position: "top-right",
            ...options
        };

        const props = { title, type }

        switch (type) {
            case 'success':
                toast.success(
                    <ToastCustom
                        key={uuid()}
                        {...props}
                    />, toastOptions);
                break;
            case 'error':
                toast.error(
                    <ToastCustom
                        key={uuid()}
                        {...props}
                    />, toastOptions);
                break;
            case 'warn':
                toast.warning(
                    <ToastCustom
                        key={uuid()}
                        {...props}
                    />, toastOptions);
                break;
            case 'info':
                toast.info(
                    <ToastCustom
                        key={uuid()}
                        {...props}
                    />, toastOptions);
                break;
            case 'default':
            default:
                toast(<ToastCustom
                    key={uuid()}
                    {...props}
                />, toastOptions)
        }
    }

    static success(title: string, options: ExternalToast = {}) {
        this.show(title, 'success', options);
    }

    static error(title: string, options: ExternalToast = {}) {
        this.show(title, 'error', options);
    }

    static warn(title: string, options: ExternalToast = {}) {
        this.show(title, 'warn', options);
    }

    static info(title: string, options: ExternalToast = {}) {
        this.show(title, 'info', options);
    }

    static default(title: string, options: ExternalToast = {}) {
        this.show(title, 'default', options)
    }
}

export default AviancaToast;