import "./form.scss";
import React, { FocusEventHandler, KeyboardEventHandler, MouseEventHandler, useState } from "react";
import { validateFormItem, Validation } from "./models/validations";
import { Permission } from "./models/permissions";
import useVanoraStore from "../../core/core";

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type FormType = {
    /**
    * Manually submits the form. Validations still must be met.
    */
    submit: () => void,
    /**
    * Clears all form elements.
    */
    clear: () => void,
    /**
    * Gets form element data as FormItem type.
    */
    get: (name: string) => FormItem | undefined,
    /**
    * Gets all form elements data as FormItem[].
    */
    getAll: () => FormItem[] | undefined,
    /**
    * Gets all form elements data as serializable object.
    */
    getAllJson: () => Promise<any>,
    /**
    * Gets all form elements data as FormData object.
    */
    getFormData: () => Promise<FormData>,
    /**
    * Gets specified form element's value.
    */
    getVal: (name: string) => string,
    /**
    * Sets specified form element's value.
    */
    setVal: (name: string, value: string) => void,
    /**
    * Gets extra data added to element, such as file data. 
    */
    getData: (name: string) => any,
    /**
    * Gets Google Recaptcha Token programmatically.
    */
    getRecaptchaToken: () => Promise<string>,
    /**
    * Validates specified form element.
    */
    validate: (name: string) => boolean,
    /**
    * Validates all form elements.
    */
    validateAll: () => boolean,
    /**
    * Checks specified form element is valid or not.
    */
    isValid: (name: string) => boolean,
}

type FormProps = {
    onSubmit?: (form: FormType) => Promise<void>,
    onError?: (form: FormType) => void,
    form?: FormType,
    /**
    * Token label that attaches form object. Default is ReCaptchaToken.
    */
    reCaptchaLabel?: string
    classNames?: string,
    children: JSX.Element | JSX.Element[] | string | (() => JSX.Element)
}

export type FormItem = {
    name: string,
    value: string,
    type: FormItemType,
    validations?: Validation[],
    permissions?: Permission[],
    isValid?: boolean,
    data?: any
}

export type FormItemProps = {
    name: string,
    value?: string,
    validations?: Validation[],
    isValid?: boolean,
    classNames?: string,
    children?: JSX.Element | JSX.Element[] | string,
    tabIndex?: number,
    autoComplete?: string,
    onChange?: (value: string) => void,
    onFocus?: FocusEventHandler<HTMLElement>,
    onBlur?: FocusEventHandler<HTMLElement>
}

export type FormMouseEvents = {
    onClick?: MouseEventHandler<HTMLElement>,
    onMouseDown?: MouseEventHandler<HTMLElement>,
    onMouseUp?: MouseEventHandler<HTMLElement>,
    onMouseMove?: MouseEventHandler<HTMLElement>,
    onMouseEnter?: MouseEventHandler<HTMLElement>,
    onMouseLeave?: MouseEventHandler<HTMLElement>
}

export type FormKeyEvents = {
    onKeyPress?: KeyboardEventHandler<HTMLElement>,
    onKeyDown?: KeyboardEventHandler<HTMLElement>,
    onKeyUp?: KeyboardEventHandler<HTMLElement>
}

export enum FormItemType {
    Input = "input",
    Checkbox = "checkbox",
    Radio = "radio",
    Textarea = "textarea",
    Dropdown = "dropdown",
    File = "file",
    MultipleFile = "multiple-file"
}

type FormContextType = {
    model: FormItem[],
    setModel: React.Dispatch<React.SetStateAction<FormItem[]>>
}

export const FormContext = React.createContext<FormContextType | null>(null) as React.Context<FormContextType>;

/**
 * Can have any form element or react element. Each form element must have unique name. Uses FormContext.
 */
const Form = (props: FormProps) => {
    const [model, setModel] = useState<FormItem[]>([]);
    const form = useForm();
    const getRecaptchaToken = useVanoraStore(state => state.getRecaptchaToken);

    form.get = (name: string): FormItem | undefined => {
        return model.find(x => x.name === name);
    };

    form.getAll = (): any => {
        return model;
    };

    form.getAllJson = async (): Promise<any> => {
        let jsonModel: any = {};
        const [reCaptchaLabel, reCaptchaToken] = await getRecaptchaData();

        model.forEach(item => {
            jsonModel[item.name] = item.type == FormItemType.Checkbox ? item.value == "true" : item.value;
        });

        if (reCaptchaLabel && reCaptchaToken) {
            jsonModel[reCaptchaLabel] = reCaptchaToken;
        }

        return jsonModel;
    };

    form.getFormData = async (): Promise<FormData> => {
        const formData = new FormData();
        const [reCaptchaLabel, reCaptchaToken] = await getRecaptchaData();

        model.forEach(item => {
            if (item.type == FormItemType.File) {
                formData.append(item.name, item.data);
            }
            else if (item.type == FormItemType.MultipleFile) {
                for (let i = 0; i < item.data.length; i++) {
                    formData.append(item.name, item.data[i]);
                }
            }
            else {
                formData.append(item.name, item.value);
            }
        });

        if (reCaptchaLabel && reCaptchaToken) {
            formData.append(reCaptchaLabel, reCaptchaToken);
        }

        return formData;
    };

    form.getVal = (name: string): string => {
        return model.find(x => x.name === name)?.value ?? "";
    };

    form.setVal = (name: string, value: string) => {
        const item = model.find(x => x.name === name);

        if (item) {
            item.value = value;
            setModel([...model]);
        }
    };

    form.getData = (name: string): any => {
        return model.find(x => x.name === name)?.data ?? "";
    };

    form.getRecaptchaToken = async (): Promise<string> => {
        if (getRecaptchaToken) {
            return await getRecaptchaToken();
        }

        return "";
    };

    form.validate = (name: string): boolean => {
        const item = model.find(x => x.name === name);

        if (item) {
            validateFormItem(item, model);
        }

        return item?.isValid ?? true;
    };

    form.validateAll = (): boolean => {
        model.forEach(item => {
            validateFormItem(item, model);
        });

        return model.every(x => x.isValid);
    };

    form.isValid = (name: string): boolean => {
        return model.find(x => x.name === name)?.isValid ?? false;
    };

    form.clear = () => {
        model.forEach(item => {
            item.data = undefined;
            item.value = "";
            item.isValid = undefined;
            item.validations?.forEach(rule => {
                rule.isValid = undefined;
            });
        });

        setModel([...model]);
    }

    const getRecaptchaData = async () => {
        if (getRecaptchaToken) {
            return [props.reCaptchaLabel??"ReCaptchaToken", await getRecaptchaToken()];
        }

        return [undefined, undefined];
    }

    const handleSubmit = async () => {
        if (model && form.validateAll()) {
            if (props.onSubmit) {
                await props.onSubmit(form);
            }
        }
        else if (props.onError) {
            props.onError(form);
        }

        setModel([...model]);
    }

    if (props.form) {
        props.form.submit = handleSubmit;
        props.form.clear = form.clear;
        props.form.get = form.get;
        props.form.getAll = form.getAll;
        props.form.getAllJson = form.getAllJson;
        props.form.getFormData = form.getFormData;
        props.form.getVal = form.getVal;
        props.form.setVal = form.setVal;
        props.form.getData = form.getData;
        props.form.getRecaptchaToken = form.getRecaptchaToken;
        props.form.validate = form.validate;
        props.form.validateAll = form.validateAll;
        props.form.isValid = form.isValid;
    }

    return (
        <>
            <FormContext.Provider value={{ model, setModel }}>
                <form className={(props.classNames ? " " + props.classNames : "general")} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
                    {(typeof props.children).toLocaleLowerCase() == "function" ?
                        (props.children as Function)()
                        :
                        props.children
                    }
                </form>
            </FormContext.Provider>
        </>
    );
};

/**
 * Returns an object to give props to form component for full control on form. In most cases you should use function statement for form's children to re-render.
 */
export function useForm(): FormType {
    return {
        submit: () => { },
        clear: () => { },
        get: () => undefined,
        getAll: () => undefined,
        getAllJson: async () => undefined,
        getFormData: async () => new FormData(),
        getVal: () => "",
        setVal: () => { },
        getData: () => undefined,
        getRecaptchaToken: async () => "",
        validate: () => false,
        validateAll: () => false,
        isValid: () => false
    };
}

export default Form;