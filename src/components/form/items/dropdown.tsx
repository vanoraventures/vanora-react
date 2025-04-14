import Select from 'react-select'
import ErrorMessage from "./errorMessage";
import { KeyboardEventHandler, useContext, useEffect, useState } from "react";
import React from 'react';
import { validateFormItem } from '../models/validations';
import { FormContext, FormItemProps, FormItemType } from '..';

type DropdownProps = FormItemProps & {
    label?: string,
    placeholder?: JSX.Element | string,
    isRtl?: boolean,
    isDisabled?: boolean,
    isSearchable?: boolean,
    isClearable?: boolean,
    isMultiple?: boolean,
    options: {
        value: string | React.ReactElement | React.ReactElement[],
        label: string
    }[],
    onKeyDown?: KeyboardEventHandler<HTMLElement>,
    onMenuOpen?: () => void,
    onMenuClose?: () => void
}

const Dropdown = (props: DropdownProps) => {
    const context = useContext(FormContext);
    const item = context.model.find(x => x.name === props.name);
    const [isActive, setActive] = useState(false);

    const selectedValue = (() => {
        if (!item || !props.options) return null;

        if (item.value === "" || item.value === undefined || item.value === null) {
            return props.isMultiple ? [] : null;
        }

        if (props.isMultiple) {
            const values = item.value.split(',');
            return props.options.filter(opt => values.includes(opt.value.toString()));
        }

        return props.options.find(option => option.value === item.value);
    })();



    useEffect(() => {
        context.setModel(model => {
            if (model.some(x => x.name === props.name)) {
                throw new Error("Development error ---> Each form element must have unique name!");
            }
            else {
                model.push({
                    name: props.name,
                    value: props.value ?? "",
                    type: FormItemType.Dropdown,
                    validations: props.validations,
                    isValid: (props.validations ? props.isValid : true)
                });

                return [...model];
            }
        });

        return () => {
            context.setModel(model => [...model.filter(x => x.name !== props.name)]);
        }
    }, []);

    useEffect(() => {
        context.setModel(model => {
            const target = model.find(x => x.name == props.name);

            if (target) {
                target.value = props.value ?? "";
            }

            return [...model];
        });
    }, [props.value]);

    const handleChange = (value: any) => {
        value = props.isMultiple ? value.map((v: any) => v.value).join(',') : value.value;

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
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}
            onFocusCapture={() => { setActive(true) }}
            onBlurCapture={() => { setActive(false) }}
        >
            {props.label &&
                <label>{props.label}</label>
            }
            <Select
                className={"select-container " + (isActive ? "active" : "")}
                classNamePrefix="select"
                placeholder={props.placeholder}
                name={props.name}
                value={selectedValue}
                options={props.options}
                tabIndex={props.tabIndex}
                onChange={handleChange}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
                onMenuOpen={props.onMenuOpen}
                onMenuClose={props.onMenuClose}
                isDisabled={props.isDisabled ? true : false}
                isRtl={props.isRtl}
                isSearchable={props.isSearchable}
                isClearable={props.isClearable}
                isMulti={props.isMultiple}
            />
            {props.children}
            <ErrorMessage rules={item?.validations} />
        </div>
    )
}

export default Dropdown;