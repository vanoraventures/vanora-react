import "./form.scss";
import React, { FocusEventHandler, KeyboardEventHandler, MouseEventHandler, useState } from "react";
import { validateFormItem, Validation } from "./models/validations";
import { Permission } from "./models/permissions";

export type FormType = {
    submit: () => void,
    clear: () => void,
    get: (name: string) => FormItem | undefined,
    getAll: () => FormItem[] | undefined
    getAllJson: () => any,
    getFormData: () => FormData,
    getVal: (name: string) => string,
    setVal: (name: string, value: string) => void,
    getData: (name: string) => any,
    validate: (name: string) => boolean,
    validateAll: () => boolean,
    isValid: (name: string) => boolean,
}

type FormProps = {
    onSubmit?: (form: FormType) => void,
    onError?: (form: FormType) => void,
    form?: FormType,
    classNames?: string,
    children: JSX.Element | JSX.Element[] | string | (() => JSX.Element)
}

export type FormItem = {
    name: string,
    value: string,
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

    form.get = (name: string): FormItem | undefined => {
        return model.find(x => x.name === name);
    };

    form.getAll = (): any => {
        return model;
    };

    form.getAllJson = (): any => {
        let jsonModel: any = {};

        model.forEach(item => {
            jsonModel[item.name] = item.value;
        });

        return jsonModel;
    };

    form.getFormData = (): FormData => {
        var formData = new FormData();

        model.forEach(item => {
            formData.append(item.name, item.data??item.value);
        });

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
            item.value = "";
            item.isValid = undefined;
            item.validations?.forEach(rule => {
                rule.isValid = undefined;
            });
        });

        setModel([...model]);
    }

    const handleSubmit = (e?: React.SyntheticEvent) => {
        e?.preventDefault();

        if (model && form.validateAll()) {
            if (props.onSubmit) {
                props.onSubmit(form);
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
        props.form.validate = form.validate;
        props.form.validateAll = form.validateAll;
        props.form.isValid = form.isValid;
    }

    return (
        <FormContext.Provider value={{ model, setModel }}>
            <form className={(props.classNames ? " " + props.classNames : "general")} onSubmit={handleSubmit} noValidate>
                {(typeof props.children).toLocaleLowerCase() == "function" ?
                    (props.children as Function)()
                    :
                    props.children
                }
            </form>
        </FormContext.Provider>
    );
};

/**
 * Returns an object to give props to form component for full control on form. In most cases you should use function statement for form's children to re-render.
 */
export function useForm(): FormType {
    return {
        submit: () => {},
        clear: () => {},
        get: () => undefined,
        getAll: () => undefined,
        getAllJson: () => undefined,
        getFormData: () => new FormData(),
        getVal: () => "",
        setVal: () => { },
        getData: () => undefined,
        validate: () => false,
        validateAll: () => false,
        isValid: () => false
    };
}

export default Form;