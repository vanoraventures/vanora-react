import React, { useContext, useEffect } from 'react';
import ErrorMessage from './errorMessage';
import DatePicker from "react-datepicker";
import tr from "date-fns/locale/tr";
import { useState } from "react";
import { validateFormItem } from '../models/validations';
import { FormContext, FormItemProps, FormItemType, FormKeyEvents, FormMouseEvents } from '..';
import { Permission, permitKey } from '../models/permissions';

type InputDateProps = FormItemProps & FormKeyEvents & FormMouseEvents & {
    isDisabled?: boolean,
    label?: string,
    placeholder?: string,
    permissions?: Permission[],
    customization?: {
        minDate?: Date,
        maxDate?: Date,
        format?: string,
        enableManualTyping?: boolean,
        excludeDates?: Date[],
        filterDates?: (date: Date) => boolean,
        showYearDropdown?: boolean,
        showMonthDropdown?: boolean,
        yearDropdownRange?: number,
        submitFormat?: {
            locales?: string | string[],
            options?: Intl.DateTimeFormatOptions
        }
    }
}

const InputDate = (props: InputDateProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(props.value ? new Date(props.value) : undefined);
    const context = useContext(FormContext);
    const item = context.model.find(x => x.name === props.name);

    useEffect(() => {
        context.setModel(model => {
            if (model.some(x => x.name === props.name)) {
                throw new Error("Development error ---> Each form element must have unique name!");
            }
            else {
                model.push({
                    name: props.name,
                    value: props.value ?? "",
                    type: FormItemType.Input,
                    validations: props.validations,
                    permissions: props.permissions,
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
        if (item) {
            item.value = props.value ?? "";
            setSelectedDate(props.value ? new Date(props.value) : undefined);
            context.setModel([...context.model]);
        }
    }, [props.value]);

    useEffect(() => {
        setSelectedDate(props.value ? new Date(props.value) : undefined);
        context.setModel(model => {
            const target = model.find(x => x.name == props.name);

            if (target) {
                target.value = props.value ?? "";
            }

            return [...model];
        });
    }, [props.value]);

    const handleChange = (date: Date) => {
        const value = date?.toLocaleString(props.customization?.submitFormat?.locales ?? "tr-TR", props.customization?.submitFormat?.options ?? { year: 'numeric', month: 'numeric', day: 'numeric' });

        if (item) {
            item.value = value;
            validateFormItem(item, context.model);

            context.setModel([...context.model]);
        }

        if (props.onChange) {
            props.onChange(value);
        }

        setSelectedDate(date);
    }

    let disabled: any = {};

    if (props.isDisabled) {
        disabled["disabled"] = "disabled";
    }

    return (
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.label &&
                <label>{props.label}</label>
            }
            <DatePicker
                name={props.name}
                selected={selectedDate}
                placeholderText={props.placeholder}
                tabIndex={props.tabIndex}
                autoComplete={props.autoComplete}
                dateFormat={props.customization?.format ?? "dd/MM/yyyy"}
                locale={tr}
                minDate={props.customization?.minDate}
                maxDate={props.customization?.maxDate}
                excludeDates={props.customization?.excludeDates}
                filterDate={props.customization?.filterDates}
                scrollableYearDropdown={props.customization?.showYearDropdown}
                showYearDropdown={props.customization?.showYearDropdown}
                showMonthDropdown={props.customization?.showMonthDropdown}
                yearDropdownItemNumber={props.customization?.yearDropdownRange}
                onChange={(date: Date) => handleChange(date)}
                onKeyDown={(e) => {
                    if (props.customization?.enableManualTyping) {
                        permitKey(e, item);
                        
                        if (props.onKeyPress) {
                            props.onKeyPress(e);
                        }
                    }
                    else {
                        e.preventDefault();
                    }
                }}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
                onMouseMove={props.onMouseMove}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                disabledKeyboardNavigation
                {...disabled}
            />
            {props.children}
            <ErrorMessage rules={item?.validations} />
        </div>
    )
}

export default InputDate;