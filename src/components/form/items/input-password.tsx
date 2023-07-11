import React, { useContext, useEffect } from 'react';
import { FormContext, FormItemProps, FormKeyEvents, FormMouseEvents } from '..';
import { permitKey, Permission } from '../models/permissions';
import { validateFormItem } from '../models/validations';
import ErrorMessage from './errorMessage';

type InputPasswordProps = FormItemProps & FormKeyEvents & FormMouseEvents & {
    isDisabled?: boolean,
    showPassword?: boolean,
    label?: string,
    placeholder?: string,
    permissions?: Permission[]
}

const InputPassword = (props: InputPasswordProps) => {
    const context = useContext(FormContext);
    const item = context.model.find(x => x.name === props.name);

    useEffect(() => {
        if (context.model.some(x => x.name === props.name)) {
            throw new Error("Development error ---> Each form element must have unique name!");
        }

        context.setModel(model => {
            model.push({
                name: props.name,
                value: props.value ?? "",
                validations: props.validations,
                permissions: props.permissions,
                isValid: (props.validations ? props.isValid : true)
            });

            return [...model];
        });

        return () => {
            context.setModel(model => [...model.filter(x => x.name !== props.name)]);
        }
    }, []);

    const handleChange = (value: string) => {
        if (item) {
            item.value = value;
            validateFormItem(item, context.model);

            context.setModel([...context.model]);
        }

        if (props.onChange) {
            props.onChange(value);
        }
    }

    return (
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.label &&
                <label>{props.label}</label>
            }
            <input
                type={props.showPassword ? "text" : "password"}
                name={props.name}
                value={item?.value ?? ""}
                placeholder={props.placeholder}
                onChange={(e) => { handleChange(e.target.value) }}
                onKeyPress={(e) => { permitKey(e, item); if (props.onKeyPress) { props.onKeyPress(e); } }}
                onKeyDown={props.onKeyDown}
                onKeyUp={props.onKeyUp}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
                onMouseMove={props.onMouseMove}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                {...(props.isDisabled ? { disabled: true } : {})}
            />
            {props.children}
            <ErrorMessage rules={item?.validations} />
        </div>
    )
}

export default InputPassword;