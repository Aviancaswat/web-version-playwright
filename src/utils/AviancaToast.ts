import { toast, type ExternalToast } from 'sonner';

class AviancaToast {

    static show(message: string, type = 'info', options: ExternalToast) {
        const toastOptions: ExternalToast = {
            duration: 5000,
            ...options,
        };

        switch (type) {
            case 'success':
                toast.success(message, toastOptions);
                break;
            case 'error':
                toast.error(message, toastOptions);
                break;
            case 'warn':
                toast.warning(message, toastOptions);
                break;
            case 'info':
            default:
                toast.info(message, toastOptions);
                break;
        }
    }

    static success(message: string, options: ExternalToast = {}) {
        this.show(message, 'success', options);
    }

    static error(message: string, options: ExternalToast = {}) {
        this.show(message, 'error', options);
    }

    static warn(message: string, options: ExternalToast = {}) {
        this.show(message, 'warn', options);
    }

    static info(message: string, options: ExternalToast = {}) {
        this.show(message, 'info', options);
    }
}

export default AviancaToast;