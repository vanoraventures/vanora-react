import React, { useContext, useEffect, useRef } from 'react';
import { FormContext, FormItemProps, FormKeyEvents, FormMouseEvents } from '..';
import { permitKey, Permission } from '../models/permissions';
import { validateFormItem } from '../models/validations';
import ErrorMessage from './errorMessage';

type InputSplitProps = FormItemProps & FormKeyEvents & FormMouseEvents & {
    charCount: number,
    isDisabled?: boolean,
    label?: string,
    permissions?: Permission[]
}

const InputSplit = (props: InputSplitProps) => {
    const inputs = useRef(new Array<HTMLInputElement>());
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

    const handleChange = (value: string, index: number) => {
        let currentValue = "";
        for (var i = 0; i < inputs.current.length; i++) {
            currentValue += inputs.current[i].value;
        }

        if (value) {
            const newIndex = index + 1;
            if (newIndex < props.charCount) {
                inputs.current[newIndex].focus();
            }
        }

        if (item) {
            item.value = currentValue;
            validateFormItem(item, context.model);

            context.setModel([...context.model]);
        }

        if (props.onChange) {
            props.onChange(currentValue);
        }
    }

    const onKeyDown = (event: React.KeyboardEvent, index: number) => {
        const key = event.key;
        var inputValue = inputs.current[index].value;

        if (key === "ArrowLeft") {
            const newIndex = index - 1;
            if (newIndex >= 0) {
                inputs.current[newIndex].focus();
                inputs.current[newIndex].selectionStart = 1;
                inputs.current[newIndex].selectionEnd = 1;
                event.preventDefault();
            }
        }
        else if (key === "ArrowRight") {
            const newIndex = index + 1;
            if (newIndex < props.charCount) {
                inputs.current[newIndex].focus();
                inputs.current[newIndex].selectionStart = 1;
                inputs.current[newIndex].selectionEnd = 1;
                event.preventDefault();
            }
        }
        else if (key === "Backspace") {
            const newIndex = index - 1;
            if (inputValue === "" && newIndex >= 0) {
                inputs.current[newIndex].focus();
                inputs.current[newIndex].selectionStart = 1;
                inputs.current[newIndex].selectionEnd = 1;
            }
        }
    }

    let items = [];
    for (let i = 0; i < props.charCount; i++) {
        items.push(<input
            ref={e => { if (e) { inputs.current[i] = e } }}
            maxLength={1}
            type="text"
            value={item?.value.substr(i, 1) ?? ""}
            onChange={(e) => handleChange(e.target.value, i)} key={"input-split-" + i}
            onKeyPress={(e) => { permitKey(e, item); if (props.onKeyPress) { props.onKeyPress(e); } }}
            onKeyDown={(e) => { onKeyDown(e, i); if (props.onKeyDown) { props.onKeyDown(e); } }}
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
        />);
    }

    return (
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.label &&
                <label>{props.label}</label>
            }
            <div className="split-container">
                {items}
            </div>
            {props.children}
            <ErrorMessage rules={item?.validations} />
        </div>
    )
}

export default InputSplit;