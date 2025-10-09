import 'react-toastify/dist/ReactToastify.css';
import { toast, type ToasterProps } from 'sonner';
import { v4 as uuid } from "uuid";

class AviancaToast {

    static show(message: string, type = 'info', options: ToasterProps = {}) {
        const toastOptions: ToasterProps = {
            id: uuid(),
            position: 'top-right',
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

    static success(message: string, options: ToasterProps = {}) {
        this.show(message, 'success', options);
    }

    static error(message: string, options: ToasterProps = {}) {
        this.show(message, 'error', options);
    }

    static warn(message: string, options: ToasterProps = {}) {
        this.show(message, 'warn', options);
    }

    static info(message: string, options: ToasterProps = {}) {
        this.show(message, 'info', options);
    }
}

export default AviancaToast;